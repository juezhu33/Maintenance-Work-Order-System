import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

/**
 * 路由守卫组件
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 * @param {string[]} [props.allowedRoles] - 允许的角色列表，不传则只检查登录状态
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    let alive = true;

    async function checkAuth() {
      const { data } = await supabase.auth.getUser();
      if (!alive) return;

      if (!data?.user) {
        setUser(null);
        setChecking(false);
        return;
      }

      setUser(data.user);

      // 获取角色
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (alive) {
        setRole(profile?.role || null);
        setChecking(false);
      }
    }

    checkAuth();

    return () => {
      alive = false;
    };
  }, []);

  if (checking) {
    return (
      <Box
        sx={{
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 未登录，跳转登录页
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 有角色限制，检查角色
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // 角色不匹配，跳转到对应角色的首页
      if (role === "user") return <Navigate to="/user" replace />;
      if (role === "mechanic") return <Navigate to="/mechanic" replace />;
      if (role === "admin") return <Navigate to="/admin" replace />;
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
