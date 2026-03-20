import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/common/AuthForm";
import FullScreenOceanWave from "../../components/canvas/FullScreenOceanWave";
import { useLanguage } from "../../hooks/useLanguage";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError(t("auth.errors.required"));
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.errors.passwordMismatch"));
      setLoading(false);
      return;
    }
    try {
      const payload = { name, email, password };
      const res = await register(payload);
      if (res?.user) {
        navigate("/dashboard", { replace: true });
      } else if (res?.error) {
        setError(res.error);
      } else {
        setError(t("auth.errors.unknown"));
      }
    } catch (err) {
      setError(
        err?.message ||
          t("auth.errors.network", "Không thể kết nối đến server."),
      );
    } finally {
      setLoading(false);
    }
  };
  const fields = [
    {
      label: t("auth.register.nameLabel", "Name"),
      type: "text",
      value: name,
      onChange: (e) => setName(e.target.value),
    },
    {
      label: t("auth.register.emailLabel", "Email"),
      type: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      label: t("auth.register.passwordLabel", "Password"),
      type: "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
    },
    {
      label: t("auth.register.confirmPasswordLabel", "Confirm Password"),
      type: "password",
      value: confirmPassword,
      onChange: (e) => setConfirmPassword(e.target.value),
    },
  ];

  return (
    <div className="relative">
      <FullScreenOceanWave></FullScreenOceanWave>
      <div className="absolute top-1/2 left-[75%] transform -translate-x-1/3 translate-y-1/3 min-w-[400px]">
        <AuthForm
          variant="register"
          fields={fields}
          handleSubmit={handleSubmit}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
}
export default Register;
