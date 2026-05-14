import { revalidatePath } from "next/cache";
import { requireCurrentApiUser } from "@/server/auth/currentUser";
import {
  CsvParseError,
  importSubscriptionsCsv,
  previewSubscriptionsCsv,
} from "@/server/subscriptions/csv";

export async function POST(request: Request) {
  const user = await requireCurrentApiUser();
  if (user instanceof Response) {
    return user;
  }

  if (user.isAnonymous) {
    return Response.json(
      { message: "CSV import is available after signing in with email." },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const mode = formData.get("mode");

  if (!(file instanceof File)) {
    return Response.json({ message: "Upload a CSV file to import." }, { status: 400 });
  }

  try {
    const csvText = await file.text();
    const result =
      mode === "preview"
        ? await previewSubscriptionsCsv(csvText)
        : await importSubscriptionsCsv(user.id, csvText);

    if (mode !== "preview" && result.importedCount > 0) {
      revalidatePath("/");
      revalidatePath("/subscriptions");
      revalidatePath("/alerts");
      revalidatePath("/import");
    }

    return Response.json({
      message:
        mode === "preview"
          ? "CSV preview ready."
          : `${result.importedCount} subscription${
              result.importedCount === 1 ? "" : "s"
            } imported.`,
      ...result,
    });
  } catch (error) {
    if (error instanceof CsvParseError) {
      return Response.json({ message: error.message }, { status: 400 });
    }

    return Response.json({ message: "CSV import failed." }, { status: 500 });
  }
}
