import supabase from "../utils/supabase";
import { isStudentNo, toEmail } from "../utils/account";

/**
 * 用户注册
 * @param {string} account - 学号或邮箱
 * @param {string} password - 密码
 * @param {string} fullName - 姓名
 */
export default async function apiRegister(account, password, fullName) {
  const trimmed = account.trim();
  const email = toEmail(trimmed);
  const studentNo = isStudentNo(trimmed) ? parseInt(trimmed, 10) : null;

  // 1. 注册 auth 用户
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { data: null, error: authError };
  }

  // 2. 创建 profile 记录
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    student_no: studentNo,
    full_name: fullName,
    role: "user", // 默认为报修人
  });

  if (profileError) {
    return { data: authData, error: profileError };
  }

  return { data: authData, error: null };
}
