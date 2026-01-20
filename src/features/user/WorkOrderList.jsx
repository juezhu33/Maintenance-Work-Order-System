import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiWorkOrderList } from "../../services/apiWorkOrderList";
import WorkOrderItem from "./WorkOrderItem";

export default function WorkOrderList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await apiWorkOrderList();
        if (alive) setList(data);
      } catch (e) {
        if (alive) setErr(e?.message || "load failed");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          加载中...
        </Typography>
      </Box>
    );
  }

  if (err) {
    return (
      <Box>
        <Typography variant="body2" sx={{ color: "error.main" }}>
          {err}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack sx={{ mb: 1.5 }}>
        <Typography sx={{ fontWeight: 900, fontSize: 18 }}>我的工单</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          点击查看详情与进度
        </Typography>
      </Stack>

      <WorkOrderItem list={list} />

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          right: 35,
          bottom: 60,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        onClick={() => navigate("/user/add")}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
