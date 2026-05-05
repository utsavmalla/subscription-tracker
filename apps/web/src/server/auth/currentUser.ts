const devUserIdEnv = "SUBSCRIPTION_TRACKER_DEV_USER_ID";

export type CurrentUser = {
  id: string;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  const id = process.env[devUserIdEnv];

  if (!id) {
    throw new Error(
      `${devUserIdEnv} is required until Supabase Auth session wiring is implemented.`,
    );
  }

  return { id };
}
