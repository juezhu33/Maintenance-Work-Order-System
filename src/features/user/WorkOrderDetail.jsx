import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate, useParams } from "react-router-dom";
import { apiWorkOrderDetail } from "../../services/apiWorkOrderDetail";
import ImageGallery from "../../ui/ImageGallery";
import PriorityChip from "../../ui/PriorityChip";

function StatusChip({ status }) {
  if (status === "open") return <Chip size="small" label="待处理" />;
  if (status === "in_progress")
    return <Chip size="small" label="处理中" color="warning" />;
  if (status === "cancel") return <Chip size="small" label="已取消" />;
  return <Chip size="small" label="已完成" color="success" />;
}

function shortId(id, head = 13) {
  if (!id) return "";
  if (id.length <= head) return id;
  return `${id.slice(0, head)}`;
}

function formatTimeShort(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);

  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function Row({ label, value, title }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          maxWidth: "65%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
        title={title || value}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function WorkOrderDetail() {
  const nav = useNavigate();
  const { id } = useParams();

  const [demo, setDemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await apiWorkOrderDetail(id);
        if (alive) setDemo(data);
      } catch (e) {
        if (alive) setErr(e?.message || "load failed");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (err) return <Typography color="error">{err}</Typography>;
  if (!demo) return <Typography variant="body2">工单不存在</Typography>;

  const showUpdated =
    demo.updatedAt && demo.createdAt && demo.updatedAt !== demo.createdAt;

  const imgs = Array.isArray(demo.images) ? demo.images : [];

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <IconButton onClick={() => nav(-1)} size="small" aria-label="back">
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ fontWeight: 900, fontSize: 18 }}>工单详情</Typography>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 1.5 }}>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography sx={{ fontWeight: 900 }} noWrap>
              {demo.title}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <StatusChip status={demo.status} />
              <PriorityChip priority={demo.priority} />
            </Stack>
          </Stack>

          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {demo.location}
          </Typography>

          <Divider />

          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {demo.desc}
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 1.5, mt: 1.5 }}>
        <Typography sx={{ fontWeight: 900, mb: 1 }}>信息</Typography>
        <Stack spacing={1}>
          <Row label="工单编号" value={shortId(demo.id)} title={demo.id} />
          <Row label="处理人" value={demo.assigneeName || "待分配"} />
          <Row label="提交时间" value={formatTimeShort(demo.createdAt)} />
          {showUpdated && (
            <Row label="更新时间" value={formatTimeShort(demo.updatedAt)} />
          )}
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Typography sx={{ fontWeight: 900, mb: 1 }}>图片</Typography>

        <ImageGallery images={imgs} columns={3} />
      </Paper>
    </Box>
  );
}
