import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/common/AuthForm";
import FullScreenOceanWave from "../../components/canvas/FullScreenOceanWave";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
    try {
      const payload = { name, email, password };
      const res = await register(payload);
      if (res?.user) {
        navigate("/dashboard", { replace: true });
      } else if (res?.error) {
        alert(res.error);
      } else {
        alert("Lỗi không xác định. Vui lòng thử lại.");
      }
    } catch (err) {
      alert(err?.message || "Không thể kết nối đến server.");
    }
  };
  const fields = [
    {
      label: "Họ và tên",
      type: "text",
      value: name,
      onChange: (e) => setName(e.target.value),
    },
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
    {
      label: "Xác nhận mật khẩu",
      type: "password",
      value: confirmPassword,
      onChange: (e) => setConfirmPassword(e.target.value),
    },
  ];

  return (
    <div className="relative">
      <FullScreenOceanWave></FullScreenOceanWave>
      <div className="absolute top-1/2 left-[75%] transform -translate-x-1/3 translate-y-1/3 min-w-[400px]">
        <AuthForm variant="register" fields={fields} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}
export default Register;
