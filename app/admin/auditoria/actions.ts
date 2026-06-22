"use server"

import { createAdminClient } from "@/lib/supabase/server"

export async function logAudit(
  userId: string | null, 
  userEmail: string | null, 
  action: string, 
  entityType: string, 
  entityId: string | null, 
  details: any
) {
  const supabase = createAdminClient()
  await supabase.from("audit_log").insert({
    user_id: userId,
    user_email: userEmail,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details
  })
}
