// src/services/apiTickets.js
import supabase from "../utils/supabase";

/**
 * 用户端工单列表
 * 返回字段：id, title, location, status, time(提交时间), desc
 */
export async function apiWorkOrderList({
  mode = "all",
  statusIn,
  limit = 50,
  offset = 0,
} = {}) {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const user = userRes?.user;
  if (!user) throw new Error("Not signed in");

  let q = supabase
    .from("tickets")
    .select("id,title,location,status,priority,created_at,desc");

  // 注意：如果需要只显示当前用户的工单，取消下面这行的注释
  // q = q.eq("reporter_id", user.id);

  if (Array.isArray(statusIn) && statusIn.length) {
    q = q.in("status", statusIn);
  } else if (mode === "active") {
    q = q.in("status", ["open", "in_progress"]);
  } else if (mode === "history") {
    q = q.in("status", ["done", "closed", "cancel"]);
  }

  q = q.order("created_at", { ascending: false });

  const from = Math.max(0, offset);
  const to = from + Math.max(1, limit) - 1;

  const { data, error } = await q.range(from, to);
  if (error) throw error;

  return (data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    location: t.location,
    status: t.status,
    priority: t.priority,
    time: t.created_at, // 提交时间
    desc: t.desc,
  }));
}
