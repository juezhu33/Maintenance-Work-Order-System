import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { apiGetMechanicHistory } from "../../services/apiMechanic";
import { useTicketsRealtime } from "../../hooks/useTicketsRealtime";
import PriorityChip from "../../ui/PriorityChip";

function StatusChip({ value }) {
  if (value === "in_progress")
    return <Chip size="small" label="处理中" color="warning" />;
  if (value === "done")
    return <Chip size="small" label="已完成" color="success" />;
  if (value === "cancel") return <Chip size="small" label="已取消" />;
  return <Chip size="small" label={value} />;
}

function formatTime(iso) {
  if (!iso) return "";
  return iso.slice(0, 16).replace("T", " ");
}

export default function WorkOrderHistory() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      const data = await apiGetMechanicHistory();
      setList(data);
      setErr("");
    } catch (e) {
      setErr(e?.message || "加载失败");
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
            已接单的工单列表
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
        <ToggleButton value="in_progress">处理中</ToggleButton>
        <ToggleButton value="done">已完成</ToggleButton>
      </ToggleButtonGroup>

      <Stack spacing={1.5}>
        {filtered.map((item) => (
          <Paper
            key={item.id}
            variant="outlined"
            sx={{
              borderRadius: 3,
              p: 1.5,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/mechanic/detail/${item.id}`)}
          >
            <Stack spacing={1}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <Typography sx={{ fontWeight: 800 }} noWrap>
                  {item.title}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <StatusChip value={item.status} />
                  <PriorityChip priority={item.priority} />
                </Stack>
              </Stack>

              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {item.location}
              </Typography>

              <Divider />

              {item.desc && (
                <Typography variant="body2" sx={{ opacity: 0.85 }} noWrap>
                  {item.desc}
                </Typography>
              )}

              <Typography variant="body2" sx={{ opacity: 0.6, fontSize: 12 }}>
                {item.status === "in_progress"
                  ? `接单时间：${formatTime(item.createdAt)}`
                  : `结束时间：${formatTime(item.finishedAt)}`}
              </Typography>
            </Stack>
          </Paper>
        ))}

        {filtered.length === 0 && (
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              暂无记录
            </Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
