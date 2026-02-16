import { useEffect, useState } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import {
  apiGetWorkOrderDetail,
  apiUpdateWorkOrderStatus,
  apiGetMechanics,
  apiAssignToMechanic,
} from "../../services/apiAdmin";
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

export default function AdminWorkOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [snack, setSnack] = useState("");
  const [updating, setUpdating] = useState(false);

  // 维修员列表和选中的维修员
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // 先加载工单详情
        const data = await apiGetWorkOrderDetail(id);
        if (alive) setDetail(data);

        // 单独加载维修员列表，失败不影响页面显示
        try {
          const mechanicList = await apiGetMechanics();
          if (alive) setMechanics(mechanicList);
        } catch (mechErr) {
          console.warn("获取维修员列表失败:", mechErr);
        }
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

  async function handleStatusUpdate(newStatus) {
    setUpdating(true);
    try {
      await apiUpdateWorkOrderStatus(id, newStatus);
      setSnack("状态更新成功");
      setDetail((prev) => (prev ? { ...prev, status: newStatus } : prev));
    } catch (e) {
      setSnack("更新失败");
    } finally {
      setUpdating(false);
    }
  }

  async function handleAssign() {
    if (!selectedMechanic) {
      setSnack("请选择维修员");
      return;
    }
    const mechanic = mechanics.find((m) => m.id === selectedMechanic);
    if (!mechanic) return;

    setUpdating(true);
    try {
      await apiAssignToMechanic(id, mechanic.id, mechanic.fullName);
      setSnack("分配成功");
      setDetail((prev) =>
        prev
          ? { ...prev, status: "in_progress", assigneeName: mechanic.fullName }
          : prev,
      );
      setSelectedMechanic("");
    } catch (e) {
      setSnack("分配失败: " + (e?.message || ""));
    } finally {
      setUpdating(false);
    }
  }

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

  if (!detail) {
    return (
      <Box>
        <Typography variant="body2">暂无工单</Typography>
      </Box>
    );
  }

  const imgs = detail.images || [];

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Button component={RouterLink} to="/admin/workorders" sx={{ mb: 1 }}>
            返回列表
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            工单详情 #{detail.id?.slice(0, 8)}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            查看工单信息与处理情况
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          {detail.status === "open" && (
            <Button
              variant="outlined"
              disabled={updating}
              onClick={() => handleStatusUpdate("in_progress")}
            >
              开始处理
            </Button>
          )}
          {(detail.status === "open" || detail.status === "in_progress") && (
            <Button
              variant="contained"
              disabled={updating}
              onClick={() => handleStatusUpdate("done")}
            >
              标记完成
            </Button>
          )}
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 2,
        }}
      >
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
          <Typography sx={{ fontWeight: 800, mb: 1 }}>问题描述</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {detail.desc || "无描述"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 800, mb: 1 }}>图片</Typography>
          {imgs.length > 0 ? (
            <ImageGallery images={imgs} columns={3} />
          ) : (
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              暂无图片
            </Typography>
          )}
        </Paper>

        <Paper
          variant="outlined"
          sx={{ borderRadius: 3, p: 2.5, height: "fit-content" }}
        >
          <Typography sx={{ fontWeight: 800, mb: 1 }}>状态</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <StatusChip status={detail.status} />
            <PriorityChip priority={detail.priority} />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 800, mb: 1 }}>信息</Typography>
          <Stack spacing={1}>
            <Row label="报修人" value={detail.reporterName || "-"} />
            <Row label="维修人" value={detail.assigneeName || "-"} />
            <Row label="位置" value={detail.location || "-"} />
            <Row label="提交时间" value={formatTime(detail.createdAt)} />
            <Row label="更新时间" value={formatTime(detail.updatedAt)} />
          </Stack>

          {/* 分配维修员 */}
          {detail.status === "open" && mechanics.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography sx={{ fontWeight: 800, mb: 1 }}>
                分配维修员
              </Typography>
              <Stack spacing={1.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>选择维修员</InputLabel>
                  <Select
                    value={selectedMechanic}
                    label="选择维修员"
                    onChange={(e) => setSelectedMechanic(e.target.value)}
                    disabled={updating}
                  >
                    {mechanics.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleAssign}
                  disabled={updating || !selectedMechanic}
                  fullWidth
                >
                  确认分配
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={!!snack}
        autoHideDuration={2000}
        onClose={() => setSnack("")}
        message={snack}
      />
    </Box>
  );
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
