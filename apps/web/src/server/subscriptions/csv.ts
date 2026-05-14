import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { Prisma } from "@prisma/client";
import { calculateSubscriptionStatus } from "@/lib/subscriptions/status";
import {
  type SubscriptionDisplayCycle,
  type SubscriptionListFilters,
  type SubscriptionMutationInput,
  toDisplayCycle,
} from "@/lib/subscriptions/types";
import { prisma } from "@/server/db/prisma";
import { validateSubscriptionInput } from "./validation";

const csvHeaders = [
  "service",
  "amount",
  "cycle",
  "nextRenewal",
  "expiration",
  "datePaid",
  "done",
  "remarks",
  "status",
  "updated",
] as const;

const fieldAliases: Record<keyof SubscriptionMutationInput, string[]> = {
  service: ["service", "serviceName", "service name", "name", "subscription"],
  amount: ["amount", "usdAmount", "usd amount", "price", "cost"],
  cycle: ["cycle", "renewalCycle", "renewal cycle", "billing cycle", "frequency"],
  nextRenewal: [
    "nextRenewal",
    "next renewal",
    "nextRenewalDate",
    "next renewal date",
    "renewal date",
  ],
  expiration: ["expiration", "expirationDate", "expiration date", "expires", "end date"],
  datePaid: ["datePaid", "date paid", "paid date", "payment date", "last paid"],
  done: ["done", "completed", "paid", "is done"],
  remarks: ["remarks", "notes", "note", "comment", "comments"],
};

export type CsvImportIssue = {
  row: number;
  field?: keyof SubscriptionMutationInput;
  message: string;
};

export type CsvPreviewRow = SubscriptionMutationInput & {
  row: number;
  issues: CsvImportIssue[];
};

export type CsvImportResult = {
  importedCount: number;
  validCount: number;
  invalidCount: number;
  totalRows: number;
  previewRows: CsvPreviewRow[];
  issues: CsvImportIssue[];
};

type ParsedCsvRow = Record<string, string | undefined>;

export async function previewSubscriptionsCsv(csvText: string): Promise<CsvImportResult> {
  const result = parseSubscriptionsCsv(csvText);

  return {
    ...result,
    importedCount: 0,
  };
}

export async function importSubscriptionsCsv(
  userId: string,
  csvText: string,
): Promise<CsvImportResult> {
  const result = parseSubscriptionsCsv(csvText);

  if (result.validInputs.length > 0) {
    await prisma.subscription.createMany({
      data: result.validInputs.map((input) => {
        const validation = validateSubscriptionInput(input);

        if (!validation.ok) {
          throw new Error("Validated CSV input became invalid before import.");
        }

        const status = calculateSubscriptionStatus(validation.data);

        return {
          userId,
          ...validation.data,
          status: status.status,
          alertState: status.alertState,
        };
      }),
    });
  }

  return {
    importedCount: result.validInputs.length,
    validCount: result.validInputs.length,
    invalidCount: result.invalidCount,
    totalRows: result.totalRows,
    previewRows: result.previewRows,
    issues: result.issues,
  };
}

export async function exportSubscriptionsCsv(
  userId: string,
  filters: SubscriptionListFilters = {},
): Promise<string> {
  const subscriptions = await prisma.subscription.findMany({
    where: buildWhere(userId, filters),
    orderBy: [{ serviceName: "asc" }, { updatedAt: "desc" }],
  });

  return stringify(
    subscriptions.map((subscription) => ({
      service: subscription.serviceName,
      amount: subscription.usdAmount?.toString() ?? "",
      cycle: toDisplayCycle(subscription.renewalCycle),
      nextRenewal: formatDate(subscription.nextRenewalDate),
      expiration: formatDate(subscription.expirationDate),
      datePaid: formatDate(subscription.datePaid),
      done: subscription.done ? "true" : "false",
      remarks: subscription.remarks ?? "",
      status: subscription.status,
      updated: formatDate(subscription.updatedAt),
    })),
    {
      header: true,
      columns: csvHeaders,
    },
  );
}

function parseSubscriptionsCsv(csvText: string) {
  const rows = parseCsv(csvText);
  const previewRows: CsvPreviewRow[] = [];
  const issues: CsvImportIssue[] = [];
  const validInputs: SubscriptionMutationInput[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const input = mapCsvRow(row);
    const validation = validateSubscriptionInput(input);
    const rowIssues = validation.ok
      ? []
      : Object.entries(validation.fieldErrors ?? {}).map(([field, message]) => ({
          row: rowNumber,
          field: field as keyof SubscriptionMutationInput,
          message: message ?? validation.message,
        }));

    if (validation.ok) {
      validInputs.push(input);
    } else {
      issues.push(...rowIssues);
    }

    if (previewRows.length < 10) {
      previewRows.push({
        row: rowNumber,
        ...input,
        issues: rowIssues,
      });
    }
  });

  return {
    validInputs,
    validCount: validInputs.length,
    invalidCount: rows.length - validInputs.length,
    totalRows: rows.length,
    previewRows,
    issues,
  };
}

function parseCsv(csvText: string): ParsedCsvRow[] {
  try {
    return parse(csvText, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as ParsedCsvRow[];
  } catch (error) {
    const message = error instanceof Error ? error.message : "CSV could not be parsed.";
    throw new CsvParseError(message);
  }
}

function mapCsvRow(row: ParsedCsvRow): SubscriptionMutationInput {
  return {
    service: readField(row, "service"),
    amount: readField(row, "amount"),
    cycle: normalizeCycle(readField(row, "cycle")),
    nextRenewal: normalizeDate(readField(row, "nextRenewal")),
    expiration: normalizeDate(readField(row, "expiration")),
    datePaid: normalizeDate(readField(row, "datePaid")),
    done: normalizeBoolean(readField(row, "done")),
    remarks: readField(row, "remarks"),
  };
}

function readField(row: ParsedCsvRow, field: keyof SubscriptionMutationInput): string {
  const aliases = fieldAliases[field].map(normalizeHeader);
  const entry = Object.entries(row).find(([key]) => aliases.includes(normalizeHeader(key)));

  return entry?.[1]?.trim() ?? "";
}

function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeCycle(value: string): SubscriptionDisplayCycle {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  switch (normalized) {
    case "quarterly":
    case "quarter":
      return "Quarterly";
    case "yearly":
    case "annual":
    case "annually":
      return "Yearly";
    case "onetime":
    case "oneoff":
    case "single":
      return "One-time";
    case "monthly":
    case "month":
    default:
      return "Monthly";
  }
}

function normalizeBoolean(value: string): boolean {
  return ["1", "true", "yes", "y", "done", "completed", "paid"].includes(
    value.trim().toLowerCase(),
  );
}

function normalizeDate(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const isoMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  if (isoMatch) {
    return formatDateParts(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));
  }

  const slashMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (slashMatch) {
    return formatDateParts(Number(slashMatch[3]), Number(slashMatch[1]), Number(slashMatch[2]));
  }

  return trimmed;
}

function formatDateParts(year: number, month: number, day: number): string {
  return `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function formatDate(value: Date | null): string {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

function buildWhere(
  userId: string,
  filters: SubscriptionListFilters,
): Prisma.SubscriptionWhereInput {
  const where: Prisma.SubscriptionWhereInput = { userId };

  if (filters.search?.trim()) {
    const search = filters.search.trim();
    where.OR = [
      { serviceName: { contains: search, mode: "insensitive" } },
      { remarks: { contains: search, mode: "insensitive" } },
    ];
  }

  if (filters.status && filters.status !== "All") {
    where.status = filters.status;
  }

  if (filters.cycle && filters.cycle !== "All") {
    where.renewalCycle = filters.cycle === "One-time" ? "OneTime" : filters.cycle;
  }

  if (filters.doneState && filters.doneState !== "All") {
    where.done = filters.doneState === "Done";
  }

  if (filters.dateRange && filters.dateRange !== "Any time") {
    where.nextRenewalDate = buildDateRange(filters.dateRange);
  }

  return where;
}

function buildDateRange(
  dateRange: NonNullable<SubscriptionListFilters["dateRange"]>,
): Prisma.DateTimeNullableFilter {
  const today = startOfUtcDay(new Date());
  const end = new Date(today);

  if (dateRange === "This week") {
    end.setUTCDate(today.getUTCDate() + 7);
  } else if (dateRange === "Next 30 days") {
    end.setUTCDate(today.getUTCDate() + 30);
  } else {
    end.setUTCDate(today.getUTCDate() + 90);
  }

  return { gte: today, lte: end };
}

function startOfUtcDay(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

export class CsvParseError extends Error {}
