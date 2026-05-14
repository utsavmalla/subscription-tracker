"use client";

import { useMemo, useState } from "react";
import {
  cycleOptions,
  dateRangeOptions,
  doneOptions,
  statusOptions,
} from "@/data/subscriptions";
import type { SubscriptionMutationInput } from "@/lib/subscriptions/types";

type ImportIssue = {
  row: number;
  field?: keyof SubscriptionMutationInput;
  message: string;
};

type PreviewRow = SubscriptionMutationInput & {
  row: number;
  issues: ImportIssue[];
};

type ImportResponse = {
  message: string;
  importedCount: number;
  validCount: number;
  invalidCount: number;
  totalRows: number;
  previewRows: PreviewRow[];
  issues: ImportIssue[];
};

type Props = {
  isGuest: boolean;
};

const expectedColumns = [
  "service",
  "amount",
  "cycle",
  "nextRenewal",
  "expiration",
  "datePaid",
  "done",
  "remarks",
];

export function ImportExportClient({ isGuest }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportResponse | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [cycle, setCycle] = useState("All");
  const [doneState, setDoneState] = useState("All");
  const [dateRange, setDateRange] = useState("Any time");

  const canImport = useMemo(
    () => Boolean(file && preview && preview.validCount > 0 && !isGuest),
    [file, preview, isGuest],
  );

  const handleFileChange = async (nextFile: File | null) => {
    setFile(nextFile);
    setPreview(null);
    setMessage("");
    setError("");

    if (!nextFile) {
      return;
    }

    await submitCsv(nextFile, "preview");
  };

  const submitCsv = async (targetFile: File, mode: "preview" | "import") => {
    const formData = new FormData();
    formData.append("file", targetFile);
    formData.append("mode", mode);

    setError("");
    setMessage("");
    setIsPreviewing(mode === "preview");
    setIsImporting(mode === "import");

    try {
      const response = await fetch("/api/subscriptions/import", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as ImportResponse;

      if (!response.ok) {
        setError(payload.message ?? "CSV import failed.");
        return;
      }

      setPreview(payload);
      setMessage(payload.message);
    } catch {
      setError("CSV import failed.");
    } finally {
      setIsPreviewing(false);
      setIsImporting(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      return;
    }

    await submitCsv(file, "import");
  };

  const handleExport = async (scope: "all" | "filtered") => {
    setError("");
    setMessage("");
    setIsExporting(true);

    const params = new URLSearchParams({ scope });
    if (scope === "filtered") {
      params.set("search", search);
      params.set("status", status);
      params.set("cycle", cycle);
      params.set("doneState", doneState);
      params.set("dateRange", dateRange);
    }

    try {
      const response = await fetch(`/api/subscriptions/export?${params.toString()}`);

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        setError(payload.message ?? "CSV export failed.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getFilename(response.headers.get("Content-Disposition"));
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setMessage("CSV export ready.");
    } catch {
      setError("CSV export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
              Import / Export
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Move subscription data
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Upload spreadsheet CSV data, review row validation, and download your subscription records.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            CSV
          </span>
        </div>
      </section>

      {(message || error || isGuest) && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            error || isGuest
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-teal-200 bg-teal-50 text-teal-900"
          }`}
        >
          {error || (isGuest ? "Import and export are available after signing in with email." : message)}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">Import CSV</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Valid rows can be imported even when other rows need cleanup.
              </p>
            </div>
            {preview && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {preview.validCount} valid / {preview.invalidCount} invalid
              </span>
            )}
          </div>

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center hover:border-teal-500 hover:bg-teal-50">
            <span className="text-sm font-semibold text-slate-900">
              {file ? file.name : "Choose a CSV file"}
            </span>
            <span className="mt-2 text-xs text-slate-500">
              Expected columns: {expectedColumns.join(", ")}
            </span>
            <input
              type="file"
              accept=".csv,text/csv"
              disabled={isGuest || isPreviewing || isImporting}
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
              className="sr-only"
            />
          </label>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!canImport || isImporting}
              onClick={handleImport}
              className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isImporting ? "Importing..." : "Import valid rows"}
            </button>
            {isPreviewing && <span className="text-sm text-slate-500">Previewing CSV...</span>}
          </div>

          {preview?.previewRows.length ? (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Row</th>
                    <th className="px-3 py-3">Service</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Cycle</th>
                    <th className="px-3 py-3">Renewal</th>
                    <th className="px-3 py-3">Issues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {preview.previewRows.map((row) => (
                    <tr key={row.row}>
                      <td className="px-3 py-3 text-slate-500">{row.row}</td>
                      <td className="px-3 py-3 font-medium text-slate-900">{row.service || "-"}</td>
                      <td className="px-3 py-3 text-slate-700">{row.amount || "-"}</td>
                      <td className="px-3 py-3 text-slate-700">{row.cycle}</td>
                      <td className="px-3 py-3 text-slate-700">
                        {row.nextRenewal || row.expiration || "-"}
                      </td>
                      <td className="px-3 py-3 text-rose-700">
                        {row.issues.map((issue) => issue.message).join(" ") || "Ready"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {preview?.issues.length ? (
            <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4">
              <h3 className="text-sm font-semibold text-rose-900">Validation issues</h3>
              <ul className="mt-3 space-y-2 text-sm text-rose-800">
                {preview.issues.slice(0, 8).map((issue, index) => (
                  <li key={`${issue.row}-${issue.field ?? "row"}-${index}`}>
                    Row {issue.row}: {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">Export data</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Download every subscription or apply filters before exporting.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-900">
              Search
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Service or remarks"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
            </label>

            <label className="text-sm font-semibold text-slate-900">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                {statusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold text-slate-900">
              Cycle
              <select
                value={cycle}
                onChange={(event) => setCycle(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                {cycleOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold text-slate-900">
              Done state
              <select
                value={doneState}
                onChange={(event) => setDoneState(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                {doneOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold text-slate-900 sm:col-span-2">
              Renewal window
              <select
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isGuest || isExporting}
              onClick={() => handleExport("all")}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Export all
            </button>
            <button
              type="button"
              disabled={isGuest || isExporting}
              onClick={() => handleExport("filtered")}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? "Exporting..." : "Export filtered"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function getFilename(contentDisposition: string | null): string {
  const match = /filename="([^"]+)"/.exec(contentDisposition ?? "");
  return match?.[1] ?? "subscriptions.csv";
}
