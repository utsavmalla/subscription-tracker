const appRefreshUrl = Deno.env.get("APP_REFRESH_URL");
const refreshSecret = Deno.env.get("REMINDER_REFRESH_SECRET");

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return Response.json({ message: "Method not allowed." }, { status: 405 });
  }

  if (!appRefreshUrl || !refreshSecret) {
    return Response.json(
      { message: "Missing APP_REFRESH_URL or REMINDER_REFRESH_SECRET." },
      { status: 500 },
    );
  }

  const response = await fetch(appRefreshUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshSecret}`,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();
  let body: unknown = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
  }

  return Response.json(
    {
      ok: response.ok,
      status: response.status,
      result: body,
    },
    { status: response.ok ? 200 : 502 },
  );
});
