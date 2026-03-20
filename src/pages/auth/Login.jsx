import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/common/AuthForm";
import FullScreenOceanWave from "../../components/canvas/FullScreenOceanWave";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth(); // <-- use auth context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(t("auth.errors.required"));
      return;
    }
    // Note: Login doesn't confirm password here; keep validation minimal.

    setLoading(true);
    try {
      const payload = { email, password };

      const res = await login(payload); // <-- call context

      if (res?.user) {
        navigate("/dashboard", { replace: true });
      } else if (res?.error) {
        setError(res.error);
      } else {
        setError(t("auth.errors.unknown"));
      }
    } catch (err) {
      setError(err?.message || t("auth.errors.network"));
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
      else setError(t("auth.errors.googleSignIn"));
    } catch (err) {
      setError(err?.message || t("auth.errors.googleSignIn"));
    } finally {
      setLoading(false);
    }
  };
  const fields = [
    {
      label: t("auth.login.emailLabel"),
      type: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      label: t("auth.login.passwordLabel"),
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
