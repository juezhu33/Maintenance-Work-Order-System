import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function MechanicNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const base = "/mechanic";
  const value = pathname.startsWith(`${base}/history`) ? 1 : 0;

  const handleChange = (e, newValue) => {
    const next = newValue === 1 ? `${base}/history` : `${base}/news`;
    if (next !== pathname) navigate(next);
  };

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Tabs value={value} onChange={handleChange} sx={{ flex: 1 }}>
        <Tab label="新工单" />
        <Tab label="历史工单" />
      </Tabs>
      <IconButton onClick={handleLogout} size="small" title="退出登录">
        <LogoutIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
