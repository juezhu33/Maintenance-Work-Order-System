import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import { useLocation, useNavigate } from "react-router-dom";

export default function UserNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const value = pathname.startsWith("/add") ? 1 : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={(e, newValue) => navigate(newValue === 1 ? "/add" : "/user")}
        centered
      >
        <Tab label="主页" />
        <Tab label="添加工单" />
      </Tabs>
    </Box>
  );
}
