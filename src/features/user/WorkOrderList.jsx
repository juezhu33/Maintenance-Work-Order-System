import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import { apiWorkOrderList } from "../../services/apiWorkOrderList";
import { useTicketsRealtime } from "../../hooks/useTicketsRealtime";
import WorkOrderItem from "./WorkOrderItem";

export default function WorkOrderList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      const data = await apiWorkOrderList();
      setList(data);
      setErr("");
    } catch (e) {
      setErr(e?.message || "load failed");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  // 实时刷新
  useTicketsRealtime(fetchData);

  const filtered = useMemo(() => {
    if (filter === "all") return list;
    return list.filter((x) => x.status === filter);
  }, [filter, list]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
            我的工单
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            点击查看详情与进度
          </Typography>
        </Box>
        <Chip size="small" label={`共 ${filtered.length} 条`} />
      </Stack>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(e, v) => v && setFilter(v)}
        size="small"
        sx={{ mb: 1.5 }}
      >
        <ToggleButton value="all">全部</ToggleButton>
        <ToggleButton value="open">待处理</ToggleButton>
        <ToggleButton value="in_progress">处理中</ToggleButton>
        <ToggleButton value="done">已完成</ToggleButton>
      </ToggleButtonGroup>

      <WorkOrderItem list={filtered} />

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
