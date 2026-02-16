import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function UserNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const value = pathname.startsWith("/user/add") ? 1 : 0;

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Tabs
        value={value}
        onChange={(e, newValue) =>
          navigate(newValue === 1 ? "/user/add" : "/user")
        }
        sx={{ flex: 1 }}
      >
        <Tab label="主页" />
        <Tab label="添加工单" />
      </Tabs>
      <IconButton onClick={handleLogout} size="small" title="退出登录">
        <LogoutIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
