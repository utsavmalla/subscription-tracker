"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/server/auth/currentUser";
import {
  countSubscriptions,
  createSubscription,
  deleteSubscription,
  markSubscriptionDone,
  updateSubscription,
} from "@/server/subscriptions/service";
import type {
  ActionResult,
  SubscriptionMutationInput,
} from "@/lib/subscriptions/types";

const guestSubscriptionLimit = 10;

export async function createSubscriptionAction(
  input: SubscriptionMutationInput,
): Promise<ActionResult> {
  const user = await requireCurrentUser();
  const guestLimitResult = await enforceGuestCreateLimit(user.id, user.isAnonymous);
  if (guestLimitResult) {
    return guestLimitResult;
  }

  const result = await createSubscription(user.id, input);

  if (result.ok) {
    revalidateSubscriptionPaths(result.id);
  }

  return result;
}

export async function updateSubscriptionAction(
  id: string,
  input: SubscriptionMutationInput,
): Promise<ActionResult> {
  const user = await requireCurrentUser();
  const result = await updateSubscription(user.id, id, input);

  if (result.ok) {
    revalidateSubscriptionPaths(id);
  }

  return result;
}

export async function deleteSubscriptionAction(id: string): Promise<ActionResult> {
  const user = await requireCurrentUser();
  const result = await deleteSubscription(user.id, id);

  if (result.ok) {
    revalidateSubscriptionPaths(id);
  }

  return result;
}

export async function markSubscriptionDoneAction(
  id: string,
  done: boolean,
): Promise<ActionResult> {
  const user = await requireCurrentUser();
  const result = await markSubscriptionDone(user.id, id, done);

  if (result.ok) {
    revalidateSubscriptionPaths(id);
  }

  return result;
}

async function enforceGuestCreateLimit(
  userId: string,
  isAnonymous: boolean,
): Promise<ActionResult | null> {
  if (!isAnonymous) {
    return null;
  }

  const subscriptionCount = await countSubscriptions(userId);

  if (subscriptionCount < guestSubscriptionLimit) {
    return null;
  }

  return {
    ok: false,
    message:
      "Guest mode is limited to 10 subscriptions. Add an email on the login page to keep going.",
  };
}

function revalidateSubscriptionPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/subscriptions");
  revalidatePath("/alerts");

  if (id) {
    revalidatePath(`/subscriptions/${id}`);
    revalidatePath(`/subscriptions/${id}/edit`);
  }
}
