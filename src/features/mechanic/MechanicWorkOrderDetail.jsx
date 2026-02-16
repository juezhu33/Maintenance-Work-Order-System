import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  Snackbar,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  apiGetWorkOrderDetail,
  apiCompleteWorkOrder,
  apiClaimWorkOrder,
} from "../../services/apiMechanic";
import ImageGallery from "../../ui/ImageGallery";
import PriorityChip from "../../ui/PriorityChip";

function StatusChip({ status }) {
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

function Row({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function MechanicWorkOrderDetail() {
  const nav = useNavigate();
  const { id } = useParams();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [snack, setSnack] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await apiGetWorkOrderDetail(id);
        if (alive) setDetail(data);
      } catch (e) {
        if (alive) setErr(e?.message || "加载失败");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  async function handleComplete() {
    setUpdating(true);
    try {
      await apiCompleteWorkOrder(id);
      setSnack("已标记完成");
      setDetail((prev) => (prev ? { ...prev, status: "done" } : prev));
    } catch (e) {
      setSnack("操作失败");
    } finally {
      setUpdating(false);
    }
  }

  async function handleClaim() {
    setUpdating(true);
    try {
      await apiClaimWorkOrder(id);
      setSnack("接单成功");
      setDetail((prev) => (prev ? { ...prev, status: "in_progress" } : prev));
    } catch (e) {
      setSnack("接单失败");
    } finally {
      setUpdating(false);
    }
  }

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (err) return <Typography color="error">{err}</Typography>;
  if (!detail) return <Typography variant="body2">工单不存在</Typography>;

  const imgs = detail.images || [];
  const isOpen = detail.status === "open";
  const isInProgress = detail.status === "in_progress";

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
              {detail.title}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <StatusChip status={detail.status} />
              <PriorityChip priority={detail.priority} />
            </Stack>
          </Stack>

          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {detail.location}
          </Typography>

          <Divider />

          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {detail.desc || "无描述"}
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 1.5, mt: 1.5 }}>
        <Typography sx={{ fontWeight: 900, mb: 1 }}>信息</Typography>
        <Stack spacing={1}>
          <Row label="工单编号" value={detail.id?.slice(0, 13) || "-"} />
          <Row label="报修人" value={detail.reporterName || "-"} />
          <Row label="提交时间" value={formatTime(detail.createdAt)} />
          <Row label="更新时间" value={formatTime(detail.updatedAt)} />
        </Stack>
      </Paper>

      {imgs.length > 0 && (
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 1.5, mt: 1.5 }}>
          <Typography sx={{ fontWeight: 900, mb: 1 }}>图片</Typography>
          <ImageGallery images={imgs} columns={3} />
        </Paper>
      )}

      {isOpen && (
        <Stack sx={{ mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={updating}
            onClick={handleClaim}
          >
            接单
          </Button>
        </Stack>
      )}

      {isInProgress && (
        <Stack sx={{ mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={updating}
            onClick={handleComplete}
          >
            标记完成
          </Button>
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
