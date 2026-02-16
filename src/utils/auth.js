import supabase from "./supabase";

// 退出登录
export async function logout() {
  await supabase.auth.signOut();
}
