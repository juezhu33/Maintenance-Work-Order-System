import * as React from "react";
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

const rows = [
  {
    id: "1001",
    title: "宿舍灯坏了",
    status: "open",
    priority: "medium",
    updatedAt: "2026-01-20 10:21",
  },
  {
    id: "1002",
    title: "水龙头漏水",
    status: "in_progress",
    priority: "high",
    updatedAt: "2026-01-20 09:12",
  },
  {
    id: "1003",
    title: "门锁卡住",
    status: "closed",
    priority: "low",
    updatedAt: "2026-01-19 16:40",
  },
];

function statusChip(status) {
  if (status === "open") return <Chip size="small" label="待处理" />;
  if (status === "in_progress")
    return <Chip size="small" label="处理中" color="warning" />;
  return <Chip size="small" label="已完成" color="success" />;
}

export default function AdminWorkOrderList() {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return rows;
    return rows.filter(
      (r) => r.title.toLowerCase().includes(kw) || r.id.includes(kw),
    );
  }, [q]);

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
            简单管理全部工单
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <TextField
            size="small"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索 id 或标题"
          />
          <Button variant="contained" onClick={() => {}}>
            新建
          </Button>
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>标题</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>状态</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>优先级</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>更新时间</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 120 }}>操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.title}</TableCell>
                <TableCell>{statusChip(r.status)}</TableCell>
                <TableCell>{r.priority}</TableCell>
                <TableCell>{r.updatedAt}</TableCell>
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
