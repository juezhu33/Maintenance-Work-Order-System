import supabase from "../utils/supabase";

export default async function apiLogin(account, password) {
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: account,
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

  return {
    data: authData,
    error: profileError || authError,
    role,
  };
}
