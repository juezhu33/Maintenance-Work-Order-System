// src/services/apiTickets.js
import supabase from "../utils/supabase";

// 改成你自己的 bucket 名
const TICKET_BUCKET = "ticket-images";

function safeFileName(name = "file") {
  return name.replace(/[^\w.\-]+/g, "_");
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * @param {Object} input
 * @param {string} input.title
 * @param {string} input.desc
 * @param {string} input.location
 * @param {"high"|"medium"|"low"} [input.priority]
 * @param {File[]} [input.files]
 * @param {string|null} [input.reporterName]  可不传，默认用 user.email
 * @returns {Promise<Object>} inserted ticket row
 */
export async function apiAddWorkOrder({
  title,
  desc,
  location = "暂定",
  priority = "medium",
  files = [],
  reporterName = null,
}) {
  // 1) 获取当前用户，官方说明这是一次网络请求，返回值可用于授权判断:contentReference[oaicite:1]{index=1}
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const user = userRes?.user;
  if (!user) throw new Error("Not signed in");

  const uploadedPaths = [];
  const imageUrls = [];

  // 2) 上传图片并生成 URL
  // upload 的参数和可选项见官方文档:contentReference[oaicite:2]{index=2}
  for (const file of files) {
    if (!file) continue;

    const path = `tickets/${user.id}/${Date.now()}_${randomId()}_${safeFileName(
      file.name,
    )}`;

    const { error: upErr } = await supabase.storage
      .from(TICKET_BUCKET)
      .upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (upErr) {
      // 简单处理：直接抛错
      throw upErr;
    }

    uploadedPaths.push(path);

    const { data: pub } = supabase.storage
      .from(TICKET_BUCKET)
      .getPublicUrl(path);

    if (pub?.publicUrl) imageUrls.push(pub.publicUrl);
  }

  // 3) 插入 tickets，insert 后链式 .select() 才会返回 data:contentReference[oaicite:3]{index=3}
  // 再用 .single() 把数组变单行对象:contentReference[oaicite:4]{index=4}
  const payload = {
    title,
    desc,
    location,
    priority,
    images: imageUrls, // text[] 或 jsonb 都能用 JS 数组写入
    reporter_id: user.id,
    reporter_name: reporterName ?? user.email ?? null,
  };

  const { data, error } = await supabase
    .from("tickets")
    .insert(payload)
    .select("*")
    .single();

  //   if (error) {
  //     // 可选：尽力清理已上传图片，remove 用法见官方文档:contentReference[oaicite:5]{index=5}
  //     // 这个清理需要你给 storage.objects 配 delete 权限策略，否则会失败
  //     if (uploadedPaths.length) {
  //       try {
  //         await supabase.storage.from(TICKET_BUCKET).remove(uploadedPaths);
  //       } catch (_) {}
  //     }
  //     throw error;
  //   }

  return data;
}
