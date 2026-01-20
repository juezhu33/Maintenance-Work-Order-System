import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useLocation, useNavigate } from "react-router-dom";

export default function UserNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const value = pathname.startsWith("/user/add") ? 1 : 0;

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "action.hover",
        borderRadius: 3,
        p: 0.5,
      }}
    >
      <Tabs
        value={value}
        onChange={(e, v) => navigate(v === 1 ? "/user/add" : "/user")}
        variant="fullWidth"
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          minHeight: 40,
          "& .MuiTab-root": {
            minHeight: 40,
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2.5,
          },
          "& .Mui-selected": {
            bgcolor: "background.paper",
            boxShadow: 1,
          },
        }}
      >
        <Tab label="主页" />
        <Tab label="新建" />
      </Tabs>
    </Box>
  );
}
