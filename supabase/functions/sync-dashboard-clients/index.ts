import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { callDashboard } from "../_shared/dashboard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DashClient {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  contact_name?: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return json({ error: "No autenticado" }, 401);
    const { data: role } = await supabase.from("user_roles").select("role")
      .eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!role) return json({ error: "Se requiere rol admin" }, 403);

    const remote = await callDashboard({ action: "list" });
    const dashClients: DashClient[] = remote.clients || [];
    let imported = 0, updated = 0;
    const codesBack: { id: string; access_code: string }[] = [];

    for (const dc of dashClients) {
      const email = dc.email?.trim().toLowerCase() || null;
      let { data: local } = await supabase.from("clients").select("id")
        .eq("dashboard_client_id", dc.id).maybeSingle();
      if (!local && email) {
        ({ data: local } = await supabase.from("clients").select("id").ilike("email", email).maybeSingle());
      }
      if (!local) {
        ({ data: local } = await supabase.from("clients").select("id")
          .is("dashboard_client_id", null).ilike("name", dc.name.trim()).maybeSingle());
      }

      let clientId: string;
      if (local) {
        clientId = local.id;
        await supabase.from("clients").update({
          dashboard_client_id: dc.id,
          address: dc.address ?? null,
          phone: dc.phone ?? undefined,
        }).eq("id", clientId);
        updated++;
      } else {
        const { data: created, error } = await supabase.from("clients").insert({
          name: dc.name, email, phone: dc.phone ?? null, address: dc.address ?? null,
          company: dc.contact_name ?? null, dashboard_client_id: dc.id,
        }).select("id").single();
        if (error) { console.error("insert error", dc.name, error.message); continue; }
        clientId = created.id;
        imported++;
      }

      const { data: codes } = await supabase.from("access_codes").select("code")
        .eq("client_id", clientId).eq("is_active", true).limit(1);
      let code = codes?.[0]?.code as string | undefined;
      if (!code) {
        const { data: newCode } = await supabase.rpc("generate_access_code");
        code = newCode as string;
        await supabase.from("access_codes").insert({ code, client_id: clientId, is_active: true });
      }
      codesBack.push({ id: dc.id, access_code: code });
    }

    // Send codes back so the dashboard can show them too (best effort)
    try { await callDashboard({ action: "set_codes", codes: codesBack }); } catch (e) { console.warn(e); }

    // Push store clients that are not yet in the dashboard
    let pushed = 0;
    const { data: pending } = await supabase.from("clients")
      .select("id, name, email, phone, address").is("dashboard_client_id", null);
    for (const c of pending || []) {
      try {
        const { data: codes } = await supabase.from("access_codes").select("code")
          .eq("client_id", c.id).eq("is_active", true).limit(1);
        const res = await callDashboard({
          action: "upsert",
          client: { name: c.name, email: c.email, phone: c.phone, address: c.address, access_code: codes?.[0]?.code ?? null },
        });
        if (res?.client?.id) {
          await supabase.from("clients").update({ dashboard_client_id: res.client.id }).eq("id", c.id);
          pushed++;
        }
      } catch (e) { console.warn("push failed", c.name, e); }
    }

    console.log(`sync done: imported=${imported} updated=${updated} pushed=${pushed}`);
    return json({ success: true, total: dashClients.length, imported, updated, pushed });
  } catch (e: any) {
    console.error("sync error", e);
    return json({ error: e.message }, 500);
  }
});
