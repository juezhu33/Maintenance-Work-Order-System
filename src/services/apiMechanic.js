// src/services/apiMechanic.js
import supabase from "../utils/supabase";

/**
 * 获取待接单的工单列表（status=open）
 */
export async function apiGetNewWorkOrders() {
  const { data, error } = await supabase
    .from("tickets")
    .select("id,title,location,desc,created_at,priority")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    location: t.location,
    desc: t.desc,
    createdAt: t.created_at,
    priority: t.priority,
  }));
}

/**
 * 接单 - 将工单状态改为 in_progress，并分配给当前用户
 * @param {string} id - 工单ID
 */
export async function apiClaimWorkOrder(id) {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const user = userRes?.user;
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("tickets")
    .update({
      status: "in_progress",
      assignee_id: user.id,
      assignee_name: user.email,
    })
    .eq("id", id);

  if (error) throw error;
  return { success: true };
}

/**
 * 获取当前维修人员的历史工单（已完成或已取消）
 */
export async function apiGetMechanicHistory({ filter = "all" } = {}) {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const user = userRes?.user;
  if (!user) throw new Error("Not signed in");

  let q = supabase
    .from("tickets")
    .select(
      "id,title,location,status,created_at,updated_at,finished_at,desc,priority",
    )
    .eq("assignee_id", user.id);

  if (filter === "in_progress") {
    q = q.eq("status", "in_progress");
  } else if (filter === "done") {
    q = q.eq("status", "done");
  } else {
    // all - 显示所有已接单的工单
    q = q.in("status", ["in_progress", "done"]);
  }

  q = q.order("updated_at", { ascending: false });

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    location: t.location,
    status: t.status,
    createdAt: t.created_at,
    finishedAt: t.updated_at,
    desc: t.desc,
    priority: t.priority,
  }));
}

/**
 * 获取工单详情（维修人员）
 * @param {string} id - 工单ID
 */
export async function apiGetWorkOrderDetail(id) {
  if (!id) throw new Error("Missing ticket id");

  const { data, error } = await supabase
    .from("tickets")
    .select(
      "id,title,status,priority,location,created_at,updated_at,desc,images,reporter_name",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    status: data.status,
    priority: data.priority,
    location: data.location,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    desc: data.desc,
    images: Array.isArray(data.images) ? data.images : [],
    reporterName: data.reporter_name,
  };
}

/**
 * 完成工单
 * @param {string} id - 工单ID
 */
export async function apiCompleteWorkOrder(id) {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("tickets")
    .update({ status: "done", updated_at: now, finished_at: now })
    .eq("id", id);

  if (error) throw error;
  return { success: true };
}
