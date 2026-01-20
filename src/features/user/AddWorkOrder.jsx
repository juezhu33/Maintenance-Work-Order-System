import * as React from "react";
import {
  Box,
  Button,
  Divider,
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

function pickImages(fileList) {
  if (!fileList || fileList.length === 0) return [];
  return Array.from(fileList).filter((f) => f && f.type?.startsWith("image/"));
}

export default function AddWorkOrder() {
  const navigate = useNavigate();

  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [images, setImages] = React.useState([]);

  const cameraInputRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const imagesRef = React.useRef([]);

  function openCamera() {
    cameraInputRef.current?.click();
  }
  function openFiles() {
    fileInputRef.current?.click();
  }

  function addFiles(fileList) {
    const files = pickImages(fileList);
    if (files.length === 0) return;

    const newItems = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const next = [...prev, ...newItems];
      imagesRef.current = next;
      return next;
    });
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
  }

  React.useEffect(() => {
    return () => {
      for (const item of imagesRef.current) {
        if (item?.url) URL.revokeObjectURL(item.url);
      }
    };
  }, []);

  function handleSubmit() {
    // TODO: 你接 Supabase
    // title, desc, images (File)
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <IconButton onClick={() => navigate(-1)} size="small" aria-label="back">
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
          提交维修工单
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 1.5 }}>
        <Stack spacing={2}>
          <TextField
            label="问题标题"
            placeholder="一句话说明问题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <TextField
            label="详细描述"
            placeholder="补充说明，可选"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            fullWidth
            multiline
            minRows={4}
          />

          <Divider />

          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 800 }}>图片</Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<PhotoCameraOutlinedIcon />}
                onClick={openCamera}
                sx={{ borderRadius: 2 }}
              >
                拍照
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadFileOutlinedIcon />}
                onClick={openFiles}
                sx={{ borderRadius: 2 }}
              >
                上传
              </Button>
            </Stack>

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
                图片预览（{images.length}）
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
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* 底部提交栏 */}
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
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ borderRadius: 2 }}
          onClick={handleSubmit}
        >
          提交
        </Button>
      </Box>

      {/* 给内容留出底部栏空间 */}
      <Box sx={{ height: 72 }} />
    </Box>
  );
}
