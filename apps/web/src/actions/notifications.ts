"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/server/auth/currentUser";
import { setEmailRemindersEnabled } from "@/server/notifications/email";
import type { NotificationActionState } from "@/lib/notifications/types";

export async function enableEmailRemindersAction(): Promise<NotificationActionState> {
  const user = await requireCurrentUser();

  if (user.isAnonymous) {
    return {
      ok: false,
      message: "Add an email to your account before enabling email reminders.",
    };
  }

  const result = await setEmailRemindersEnabled(user.id, user.email, true);
  revalidatePath("/settings");
  return result;
}

export async function disableEmailRemindersAction(): Promise<NotificationActionState> {
  const user = await requireCurrentUser();
  const result = await setEmailRemindersEnabled(user.id, user.email, false);
  revalidatePath("/settings");
  return result;
}
