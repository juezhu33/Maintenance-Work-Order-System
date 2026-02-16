import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  Divider,
  Snackbar,
} from "@mui/material";
import {
  apiGetNewWorkOrders,
  apiClaimWorkOrder,
} from "../../services/apiMechanic";
import { useTicketsRealtime } from "../../hooks/useTicketsRealtime";
import PriorityChip from "../../ui/PriorityChip";

function formatTime(iso) {
  if (!iso) return "";
  return iso.slice(0, 16).replace("T", " ");
}

export default function NewWorkOrder() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState("");
  const [claiming, setClaiming] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const data = await apiGetNewWorkOrders();
      setList(data);
    } catch (e) {
      setSnack("加载失败");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  // 实时刷新
  useTicketsRealtime(fetchData);

  async function handleClaim(id) {
    setClaiming(id);
    try {
      await apiClaimWorkOrder(id);
      setSnack("接单成功");
      setList((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setSnack("接单失败");
    } finally {
      setClaiming("");
    }
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
          <Typography sx={{ fontWeight: 900, fontSize: 18 }}>新工单</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            待接单列表
          </Typography>
        </Box>
        <Chip size="small" label={`共 ${list.length} 条`} />
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {list.map((item) => (
            <Paper
              key={item.id}
              variant="outlined"
              sx={{ borderRadius: 3, p: 1.5 }}
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
                  <PriorityChip priority={item.priority} />
                </Stack>

                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {item.location} · {formatTime(item.createdAt)}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {item.desc}
                </Typography>

                <Divider />

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/mechanic/detail/${item.id}`)}
                  >
                    查看详情
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={claiming === item.id}
                    onClick={() => handleClaim(item.id)}
                  >
                    {claiming === item.id ? "接单中..." : "接单"}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
          {list.length === 0 && (
            <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                暂无待接单工单
              </Typography>
            </Paper>
          )}
        </Stack>
      )}
      <Snackbar
        open={!!snack}
        autoHideDuration={2000}
        onClose={() => setSnack("")}
        message={snack}
      />
    </Box>
  );
}
