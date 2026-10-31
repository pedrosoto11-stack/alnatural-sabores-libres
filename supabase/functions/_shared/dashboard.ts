// Helpers to talk to the al-natural-dash "sync-clients" endpoint.
// Its URL is derived from DASHBOARD_WEBHOOK_URL (…/functions/v1/receive-order).
export function dashboardSyncUrl(): string | null {
  const base = Deno.env.get("DASHBOARD_WEBHOOK_URL");
  if (!base) return null;
  return base.replace(/receive-order\/?$/, "sync-clients");
}

export async function callDashboard(body: Record<string, unknown>) {
  const url = dashboardSyncUrl();
  const apiKey = Deno.env.get("DASHBOARD_API_KEY");
  if (!url || !apiKey) throw new Error("Dashboard no configurado");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Dashboard ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}
