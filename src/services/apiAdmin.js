// src/services/apiAdmin.js
import supabase from "../utils/supabase";

/**
 * 获取所有工单列表（管理员）
 */
export async function apiGetAllWorkOrders({ keyword = "" } = {}) {
  let q = supabase
    .from("tickets")
    .select(
      "id,title,status,priority,created_at,updated_at,location,desc,images,reporter_name,assignee_name",
    )
    .order("created_at", { ascending: false });

  const { data, error } = await q;
  if (error) throw error;

  // 过滤掉非 UUID 格式的记录（旧测试数据）
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const validData = (data ?? []).filter((t) => uuidRegex.test(t.id));

  let list = validData.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    priority: t.priority,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
    location: t.location,
    desc: t.desc,
    images: t.images,
    reporterName: t.reporter_name,
    assigneeName: t.assignee_name,
  }));

  // 前端搜索过滤
  if (keyword.trim()) {
    const kw = keyword.trim().toLowerCase();
    list = list.filter(
      (r) =>
        r.title?.toLowerCase().includes(kw) || r.id?.toLowerCase().includes(kw),
    );
  }

  return list;
}

/**
 * 获取单个工单详情（管理员）
 * @param {string} id - 工单ID
 */
export async function apiGetWorkOrderDetail(id) {
  if (!id) throw new Error("Missing ticket id");

  // 验证 UUID 格式
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("无效的工单ID");
  }

  const { data, error } = await supabase
    .from("tickets")
    .select(
      "id,title,status,priority,location,created_at,updated_at,desc,images,reporter_name,assignee_name",
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
    assigneeName: data.assignee_name,
  };
}

/**
 * 更新工单状态（管理员）
 * @param {string} id - 工单ID
 * @param {string} status - 新状态
 */
export async function apiUpdateWorkOrderStatus(id, status) {
  const now = new Date().toISOString();
  const updateData = { status, updated_at: now };

  // 如果是完成状态，记录完成时间
  if (status === "done") {
    updateData.finished_at = now;
  }

  const { error } = await supabase
    .from("tickets")
    .update(updateData)
    .eq("id", id);

  if (error) throw error;
  return { success: true };
}

/**
 * 分配工单/开始处理（管理员）
 * @param {string} id - 工单ID
 */
export async function apiAssignWorkOrder(id) {
  const { error } = await supabase
    .from("tickets")
    .update({
      status: "in_progress",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  return { success: true };
}

/**
 * 删除工单（管理员）
 * @param {string} id - 工单ID
 */
export async function apiDeleteWorkOrder(id) {
  const { error } = await supabase.from("tickets").delete().eq("id", id);

  if (error) throw error;
  return { success: true };
}

/**
 * 获取所有维修员列表
 * @returns {Promise<Array<{id: string, fullName: string, email: string}>>}
 */
export async function apiGetMechanics() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "mechanic");

  if (error) throw error;

  return (data ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name || "未命名",
  }));
}

/**
 * 分配工单给指定维修员（管理员）
 * @param {string} ticketId - 工单ID
 * @param {string} mechanicId - 维修员ID
 * @param {string} mechanicName - 维修员名称
 */
export async function apiAssignToMechanic(ticketId, mechanicId, mechanicName) {
  const { error } = await supabase
    .from("tickets")
    .update({
      status: "in_progress",
      assignee_id: mechanicId,
      assignee_name: mechanicName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId);

  if (error) throw error;
  return { success: true };
}

// ==================== 用户管理 API ====================

/**
 * 获取所有用户列表（管理员）
 */
export async function apiGetAllUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, student_no, full_name, role, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((u) => ({
    id: u.id,
    studentNo: u.student_no,
    fullName: u.full_name || "未命名",
    role: u.role,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  }));
}

/**
 * 获取指定角色的用户列表
 * @param {string} role - user | mechanic
 */
export async function apiGetUsersByRole(role) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, student_no, full_name, role, created_at")
    .eq("role", role)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((u) => ({
    id: u.id,
    studentNo: u.student_no,
    fullName: u.full_name || "未命名",
    role: u.role,
    createdAt: u.created_at,
  }));
}

/**
 * 获取某个报修人提交的工单列表
 * @param {string} userId - 报修人ID
 */
export async function apiGetUserTickets(userId) {
  const { data, error } = await supabase
    .from("tickets")
    .select("id, title, status, priority, created_at, location")
    .eq("reporter_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    priority: t.priority,
    createdAt: t.created_at,
    location: t.location,
  }));
}

/**
 * 获取某个维修员处理的工单列表
 * @param {string} mechanicId - 维修员ID
 */
export async function apiGetMechanicTickets(mechanicId) {
  const { data, error } = await supabase
    .from("tickets")
    .select("id, title, status, priority, created_at, location, reporter_name")
    .eq("assignee_id", mechanicId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    priority: t.priority,
    createdAt: t.created_at,
    location: t.location,
    reporterName: t.reporter_name,
  }));
}

/**
 * 更新用户角色（管理员）
 * @param {string} userId - 用户ID
 * @param {string} role - 新角色 (user | mechanic | admin)
 */
export async function apiUpdateUserRole(userId, role) {
  const { error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw error;
  return { success: true };
}

/**
 * 删除用户（管理员）
 * @param {string} userId - 用户ID
 */
export async function apiDeleteUser(userId) {
  const { error } = await supabase.from("profiles").delete().eq("id", userId);

  if (error) throw error;
  return { success: true };
}
