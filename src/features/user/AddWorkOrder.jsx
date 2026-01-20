import * as React from "react";
import {
  Box,
  Button,
  Divider,
  Fab,
  IconButton,
  ImageList,
  ImageListItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { apiAddWorkOrder } from "../../services/apiAddWorkOrder";

const MAX_IMAGES = 6;

function pickImages(fileList) {
  if (!fileList || fileList.length === 0) return [];

  return Array.from(fileList).filter((f) => {
    if (!f) return false;
    if (f.type && f.type.startsWith("image/")) return true;
    if (!f.type) return true;
    const name = (f.name || "").toLowerCase();
    return /\.(jpg|jpeg|png|webp|gif|heic|heif)$/.test(name);
  });
}

function hasText(s) {
  return typeof s === "string" && s.trim().length > 0;
}

export default function AddWorkOrder() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState("");

  const [touched, setTouched] = useState({
    title: false,
    location: false,
    images: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");

  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imagesRef = useRef([]);

  const titleOk = hasText(title);
  const locationOk = hasText(location);
  const imagesOk = images.length > 0;
  const canSubmit = titleOk && locationOk && imagesOk && !submitting;

  function openCamera() {
    cameraInputRef.current?.click();
  }
  function openFiles() {
    fileInputRef.current?.click();
  }

  function addFiles(fileList) {
    const files = pickImages(fileList);
    if (files.length === 0) return;

    setImages((prev) => {
      const remain = Math.max(0, MAX_IMAGES - prev.length);
      if (remain <= 0) return prev;

      const picked = files.slice(0, remain);
      const newItems = picked.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      }));

      const next = [...prev, ...newItems];
      imagesRef.current = next;
      return next;
    });

    setTouched((t) => ({ ...t, images: true }));
  }

  function onCameraChange(e) {
    addFiles(e.target.files);
    e.target.value = "";
  }
  function onFileChange(e) {
    addFiles(e.target.files);
    e.target.value = "";
  }

  function removeImage(idx) {
    setImages((prev) => {
      const target = prev[idx];
      if (target?.url) URL.revokeObjectURL(target.url);
      const next = prev.filter((_, i) => i !== idx);
      imagesRef.current = next;
      return next;
    });
    setTouched((t) => ({ ...t, images: true }));
  }

  React.useEffect(() => {
    return () => {
      for (const item of imagesRef.current) {
        if (item?.url) URL.revokeObjectURL(item.url);
      }
    };
  }, []);

  async function handleSubmit() {
    setTouched({ title: true, location: true, images: true });
    setSubmitErr("");

    if (!titleOk || !locationOk || !imagesOk || submitting) return;

    try {
      setSubmitting(true);
      await apiAddWorkOrder({
        title: title.trim(),
        desc: desc.trim(),
        location: location.trim(),
        files: images.map((x) => x.file),
      });
      navigate("/user");
    } catch (e) {
      setSubmitErr(e?.message || "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  const remainCount = Math.max(0, MAX_IMAGES - images.length);
  const reachMax = images.length >= MAX_IMAGES;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <IconButton
          onClick={() => navigate(-1)}
          size="small"
          aria-label="back"
          disabled={submitting}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
          提交维修工单
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 1.5 }}>
        <Stack spacing={2}>
          <TextField
            label="问题标题*"
            placeholder="一句话说明问题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            error={touched.title && !titleOk}
            fullWidth
            disabled={submitting}
          />

          <TextField
            label="位置*"
            placeholder="尽可能详细地填写故障位置"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, location: true }))}
            error={touched.location && !locationOk}
            fullWidth
            disabled={submitting}
          />

          <TextField
            label="详细描述"
            placeholder="补充详细信息,如故障现象等"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            disabled={submitting}
          />

          <Divider />

          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontWeight: 800 }}>
                图片*（最多 {MAX_IMAGES} 张）
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<PhotoCameraOutlinedIcon />}
                onClick={() => {
                  setTouched((t) => ({ ...t, images: true }));
                  openCamera();
                }}
                sx={{ borderRadius: 2 }}
                disabled={submitting || reachMax}
              >
                拍照
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadFileOutlinedIcon />}
                onClick={() => {
                  setTouched((t) => ({ ...t, images: true }));
                  openFiles();
                }}
                sx={{ borderRadius: 2 }}
                disabled={submitting || reachMax}
              >
                上传
              </Button>
            </Stack>

            {touched.images && !imagesOk && (
              <Typography variant="body2" sx={{ color: "error.main" }}>
                请至少上传 1 张图片
              </Typography>
            )}

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={onCameraChange}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={onFileChange}
            />
          </Stack>

          {images.length > 0 && (
            <Box>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>
                图片预览（{images.length}/{MAX_IMAGES}）
              </Typography>

              <ImageList cols={3} gap={10} sx={{ m: 0 }}>
                {images.map((img, idx) => (
                  <ImageListItem
                    key={img.id}
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    <Box
                      component="img"
                      src={img.url}
                      alt={`upload-${idx}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        aspectRatio: "1/1",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(idx)}
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        bgcolor: "rgba(0,0,0,0.55)",
                        color: "white",
                      }}
                      aria-label="remove"
                      disabled={submitting}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}

          {submitErr && (
            <Typography variant="body2" sx={{ color: "error.main" }}>
              {submitErr}
            </Typography>
          )}
        </Stack>
      </Paper>

      <Box
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          px: 1.5,
          py: 1.25,
        }}
      >
        {!canSubmit && (
          <Typography
            variant="caption"
            sx={{
              opacity: 0.7,
              display: "block",
              mt: 0.5,
              textAlign: "center",
            }}
          >
            需要填写标题，位置，并至少上传 1 张图片
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ borderRadius: 2 }}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {submitting ? "提交中..." : "提交"}
        </Button>
      </Box>

      <Box sx={{ height: 96 }} />

      <Fab
        color="primary"
        aria-label="back"
        sx={{
          position: "fixed",
          right: 16,
          bottom: 96,
          zIndex: 100,
        }}
        onClick={() => navigate("/user")}
        disabled={submitting}
      >
        {"←"}
      </Fab>
    </Box>
  );
}
