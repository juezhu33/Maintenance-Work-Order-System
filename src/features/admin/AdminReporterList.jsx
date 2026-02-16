import { useEffect, useState, useMemo, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import { apiGetUsersByRole, apiGetUserTickets } from "../../services/apiAdmin";
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

// 可展开的行组件
function ReporterRow({ user }) {
  const [open, setOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!open && tickets.length === 0) {
      setLoading(true);
      try {
        const data = await apiGetUserTickets(user.id);
        setTickets(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    setOpen(!open);
  }

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={handleToggle}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{user.studentNo || "-"}</TableCell>
        <TableCell>{user.fullName}</TableCell>
        <TableCell>{formatTime(user.createdAt)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                提交的工单
              </Typography>
              {loading ? (
                <CircularProgress size={20} />
              ) : tickets.length === 0 ? (
                <Typography variant="body2" sx={{ opacity: 0.6 }}>
                  暂无工单
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>标题</TableCell>
                      <TableCell>位置</TableCell>
                      <TableCell>状态</TableCell>
                      <TableCell>优先级</TableCell>
                      <TableCell>时间</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tickets.map((t) => (
                      <TableRow
                        key={t.id}
                        hover
                        component={RouterLink}
                        to={`/admin/workorders/${t.id}`}
                        sx={{
                          textDecoration: "none",
                          cursor: "pointer",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <TableCell>{t.title}</TableCell>
                        <TableCell>{t.location || "-"}</TableCell>
                        <TableCell>{statusChip(t.status)}</TableCell>
                        <TableCell>
                          <PriorityChip priority={t.priority} />
                        </TableCell>
                        <TableCell>{formatTime(t.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function AdminReporterList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const data = await apiGetUsersByRole("user");
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

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return list;
    return list.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(kw) ||
        u.studentNo?.toLowerCase().includes(kw),
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
      <Typography variant="body2" sx={{ color: "error.main" }}>
        {err}
      </Typography>
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
            报修人列表
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            点击展开查看提交的工单
          </Typography>
        </Box>

        <TextField
          size="small"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索姓名/学号"
        />
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 50 }} />
              <TableCell sx={{ fontWeight: 700 }}>学号</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>姓名</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>注册时间</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  暂无报修人
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => <ReporterRow key={u.id} user={u} />)
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
