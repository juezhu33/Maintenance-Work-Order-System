import { useEffect, useState, useMemo, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { apiGetAllWorkOrders } from "../../services/apiAdmin";
import { useTicketsRealtime } from "../../hooks/useTicketsRealtime";
import PriorityChip from "../../ui/PriorityChip";

function statusChip(status) {
  if (status === "open") return <Chip size="small" label="待处理" />;
  if (status === "in_progress")
    return <Chip size="small" label="处理中" color="warning" />;
  if (status === "done")
    return <Chip size="small" label="已完成" color="success" />;
  if (status === "cancel") return <Chip size="small" label="已取消" />;
  return <Chip size="small" label={status} />;
}

function formatTime(iso) {
  if (!iso) return "";
  return iso.slice(0, 16).replace("T", " ");
}

export default function AdminWorkOrderList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const data = await apiGetAllWorkOrders();
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
    const kw = q.trim().toLowerCase();
    if (!kw) return list;
    return list.filter(
      (r) =>
        r.title?.toLowerCase().includes(kw) || r.id?.toLowerCase().includes(kw),
    );
  }, [q, list]);

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
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            工单列表
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            管理全部工单
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <TextField
            size="small"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索 id 或标题"
          />
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>标题</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>报修人</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>状态</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>优先级</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>更新时间</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 120 }}>操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.id?.slice(0, 8)}</TableCell>
                <TableCell>{r.title}</TableCell>
                <TableCell>{r.reporterName || "-"}</TableCell>
                <TableCell>{statusChip(r.status)}</TableCell>
                <TableCell>
                  <PriorityChip priority={r.priority} />
                </TableCell>
                <TableCell>{formatTime(r.updatedAt || r.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    component={RouterLink}
                    to={`/admin/workorders/${r.id}`}
                    variant="outlined"
                  >
                    查看
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" sx={{ opacity: 0.7, py: 2 }}>
                    没有匹配的工单
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
