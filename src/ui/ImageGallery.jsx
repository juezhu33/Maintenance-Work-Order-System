import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

/**
 * 图片画廊组件 - 点击图片可查看大图
 * @param {string[]} images - 图片URL数组
 * @param {number} columns - 列数，默认3
 */
export default function ImageGallery({ images = [], columns = 3 }) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imgs = images.filter((url) => url);

  if (imgs.length === 0) return null;

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imgs.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < imgs.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      {/* 缩略图网格 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 1,
        }}
      >
        {imgs.map((url, idx) => (
          <Box
            key={idx}
            component="img"
            src={url}
            alt={`图片${idx + 1}`}
            onClick={() => handleOpen(idx)}
            sx={{
              width: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
              borderRadius: 2,
              bgcolor: "action.hover",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: 3,
              },
            }}
          />
        ))}
      </Box>

      {/* 大图查看 Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          onClick={handleClose}
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0, 0, 0, 0.9)",
          }}
        >
          {/* 关闭按钮 */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* 左箭头 */}
          {imgs.length > 1 && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 16,
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          {/* 大图 */}
          <Box
            component="img"
            src={imgs[currentIndex]}
            alt={`大图${currentIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: 2,
            }}
          />

          {/* 右箭头 */}
          {imgs.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 16,
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}

          {/* 图片计数器 */}
          {imgs.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: 14,
              }}
            >
              {currentIndex + 1} / {imgs.length}
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}
