import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/common/AuthForm";
import FullScreenOceanWave from "../../components/canvas/FullScreenOceanWave";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth(); // <-- use auth context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== password) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    setLoading(true);
    try {
      const payload = { email, password };

      const res = await login(payload); // <-- call context

      if (res?.user) {
        navigate("/dashboard", { replace: true });
      } else if (res?.error) {
        setError(res.error);
      } else {
        setError("Lỗi không xác định. Vui lòng thử lại.");
      }
    } catch (err) {
      setError(err?.message || "Không thể kết nối đến server.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res?.user) navigate("/dashboard", { replace: true });
      else if (res?.error) setError(res.error);
      else setError("Lỗi đăng nhập bằng Google.");
    } catch (err) {
      setError(err?.message || "Lỗi đăng nhập bằng Google.");
    } finally {
      setLoading(false);
    }
  };
  const fields = [
    {
      label: "Email",
      type: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      label: "Mật khẩu",
      type: "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
    },
  ];

  return (
    <div className="relative">
      <FullScreenOceanWave></FullScreenOceanWave>
      <div className="absolute top-1/2 left-[75%] transform -translate-x-1/3 translate-y-1/3 min-w-[400px]">
        <AuthForm
          fields={fields}
          variant="login"
          handleSubmit={handleSubmit}
          handleGoogle={handleGoogle}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
}
export default Login;
