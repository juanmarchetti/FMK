"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function getAuditLogs() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
