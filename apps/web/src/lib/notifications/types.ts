export type EmailSettingsView = {
  emailEnabled: boolean;
  emailTo: string;
  emailVerifiedAt: string;
  canEnableEmail: boolean;
};

export type NotificationActionState = {
  ok: boolean;
  message: string;
};
