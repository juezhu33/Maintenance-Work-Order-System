import supabase from "../utils/supabase";

/**
 * 工单详情
 * @param {string} id
 * @returns {Promise<{
 *  id: string,
 *  title: string,
 *  status: string,
 *  location: string,
 *  createdAt: string,
 *  updatedAt: string,
 *  desc: string,
 *  images: string[]
 * } | null>}
 */
export async function apiWorkOrderDetail(id) {
  if (!id) throw new Error("Missing ticket id");

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const user = userRes?.user;
  if (!user) throw new Error("Not signed in");
  // getUser 会向 Auth 服务器发网络请求，返回值可用于权限判断:contentReference[oaicite:1]{index=1}

  const { data, error } = await supabase
    .from("tickets")
    .select("id,title,status,location,created_at,updated_at,desc,images")
    .eq("id", id)
    .maybeSingle();
  // select + filter 的用法见文档:contentReference[oaicite:2]{index=2}

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    status: data.status,
    location: data.location,
    createdAt: data.created_at, // 提交时间
    updatedAt: data.updated_at, // 更新时间
    desc: data.desc,
    images: Array.isArray(data.images) ? data.images : [],
  };
}
