import supabase from "../utils/supabase";
import { toEmail } from "../utils/account";

export default async function apiLogin(account, password) {
  const email = toEmail(account.trim());

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password: password,
    });

  if (authError) {
    return { data: authData, error: authError, role: null };
  }

  const userId = authData.user.id;
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const role = profileError ? null : profileData.role;
  console.log(profileData);
  return {
    data: authData,
    error: profileError || authError,
    role,
  };
}
