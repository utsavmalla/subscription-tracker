type ErrorNoticeProps = Readonly<{
  title?: string;
  message: string;
}>;

export function ErrorNotice({
  title = "Something went wrong",
  message,
}: ErrorNoticeProps) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 leading-6">{message}</p>
    </div>
  );
}
