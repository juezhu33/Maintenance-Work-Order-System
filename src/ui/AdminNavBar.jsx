import { Link, useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../utils/auth";

export default function AdminNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 根据路径确定当前选中的 Tab
  let value = false;
  if (pathname.startsWith("/admin/workorders")) value = 0;
  else if (pathname.startsWith("/admin/mechanics")) value = 1;
  else if (pathname.startsWith("/admin/reporters")) value = 2;

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 3 }}>
      <Typography sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
        Admin
      </Typography>

      <Tabs value={value}>
        <Tab label="工单" component={Link} to="/admin/workorders" />
        <Tab label="维修员" component={Link} to="/admin/mechanics" />
        <Tab label="报修人" component={Link} to="/admin/reporters" />
      </Tabs>

      <Box sx={{ flex: 1 }} />

      <IconButton onClick={handleLogout} size="small" title="退出登录">
        <LogoutIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
