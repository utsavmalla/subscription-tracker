"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/server/auth/currentUser";
import {
  createSubscription,
  deleteSubscription,
  markSubscriptionDone,
  updateSubscription,
} from "@/server/subscriptions/service";
import type { SubscriptionMutationInput } from "@/lib/subscriptions/types";

export async function createSubscriptionAction(input: SubscriptionMutationInput) {
  const user = await getCurrentUser();
  const result = await createSubscription(user.id, input);

  if (result.ok) {
    revalidateSubscriptionPaths(result.id);
  }

  return result;
}

export async function updateSubscriptionAction(
  id: string,
  input: SubscriptionMutationInput,
) {
  const user = await getCurrentUser();
  const result = await updateSubscription(user.id, id, input);

  if (result.ok) {
    revalidateSubscriptionPaths(id);
  }

  return result;
}

export async function deleteSubscriptionAction(id: string) {
  const user = await getCurrentUser();
  const result = await deleteSubscription(user.id, id);

  if (result.ok) {
    revalidateSubscriptionPaths(id);
  }

  return result;
}

export async function markSubscriptionDoneAction(id: string, done: boolean) {
  const user = await getCurrentUser();
  const result = await markSubscriptionDone(user.id, id, done);

  if (result.ok) {
    revalidateSubscriptionPaths(id);
  }

  return result;
}

function revalidateSubscriptionPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/subscriptions");

  if (id) {
    revalidatePath(`/subscriptions/${id}`);
    revalidatePath(`/subscriptions/${id}/edit`);
  }
}
