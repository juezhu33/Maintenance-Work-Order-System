import {
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiRegister from "../../services/apiRegister";
import { translateError } from "../../utils/errorMessages";

export default function Register() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    setError("");

    if (!account.trim() || !password || !fullName.trim()) {
      setError("请填写完整信息");
      return;
    }

    if (password !== confirmPassword) {
      setError("两次密码不一致");
      return;
    }

    if (password.length < 6) {
      setError("密码至少6位");
      return;
    }

    setLoading(true);
    const { error: regError } = await apiRegister(account, password, fullName);
    setLoading(false);

    if (regError) {
      setError(translateError(regError.message));
      return;
    }

    // 注册成功，跳转登录页
    navigate("/login", { state: { message: "注册成功，请登录" } });
  }

  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          height: "100dvh",
          overflow: "hidden",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 4,
            transform: "translateY(-55px)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "action.hover",
                  flex: "0 0 auto",
                }}
              >
                <PersonAddIcon />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, lineHeight: 1.1 }}
                >
                  维修工单系统
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  注册
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gap: 2 }}>
              <TextField
                label="学号"
                placeholder="请输入学号"
                autoComplete="username"
                fullWidth
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />

              <TextField
                label="姓名"
                placeholder="请输入姓名"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="密码"
                placeholder="请输入密码（至少6位）"
                type="password"
                autoComplete="new-password"
                fullWidth
              />

              <TextField
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="确认密码"
                placeholder="请再次输入密码"
                type="password"
                autoComplete="new-password"
                fullWidth
              />

              {error && (
                <Typography variant="body2" sx={{ color: "error.main" }}>
                  {error}
                </Typography>
              )}

              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ borderRadius: 2 }}
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "注册中..." : "注册"}
              </Button>

              <Typography
                variant="body2"
                sx={{ textAlign: "center", opacity: 0.75 }}
              >
                已有账号？
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  size="small"
                  sx={{ textTransform: "none" }}
                >
                  去登录
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
