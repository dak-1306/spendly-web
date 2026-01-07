import { ICONS } from "../../assets/index";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import "../../styles/auth.css";
import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";

function AuthForm({ variant = "login" }) {
  const isLogin = variant === "login";
  const LOGO_COLOR = ICONS.logo_color;
  const GOOGLE = ICONS.icon_google;
  const FACEBOOK = ICONS.icon_facebook;

  // const { login, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleShow = () => setShowPassword((s) => !s);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (!isLogin && !name)) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    setLoading(true);
    try {
      const payload = isLogin ? { email, password } : { name, email, password };

      // const res = isLogin ? await login(payload) : await register(payload);
      // TEMP: mocked response for local testing while authContext is disabled
      const res = { user: { email } };

      if (res?.user) {
        navigate("/", { replace: true });
      } else if (res?.error) {
        setError(res.error);
      } else {
        setError("Lỗi không xác định. Vui lòng thử lại.");
      }
    } catch (err) {
      setError(err?.error || err?.message || "Không thể kết nối đến server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-8 rounded shadow">
      {/* Logo */}
      <div className="mb-6 text-center">
        <div
          className={`text-2xl font-bold ${
            isLogin
              ? "text-[var(--primary-blue-color)]"
              : "text-[var(--primary-green-color)]"
          }`}
        >
          <img
            src={LOGO_COLOR.src}
            alt={LOGO_COLOR.alt}
            width={LOGO_COLOR.width}
            height={LOGO_COLOR.height}
            className="mx-auto"
          />
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name (register only) */}
        {!isLogin && (
          <div className="floating">
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 border rounded"
            />
            <label htmlFor="name">Name</label>
          </div>
        )}

        {/* Email */}
        <div className="floating">
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
          />
          <label htmlFor="email">Email</label>
        </div>

        {/* Password */}
        <div className="floating relative">
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
          />
          <label htmlFor="password">Password</label>
          <button
            type="button"
            onClick={toggleShow}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="cursor-pointer" />
            ) : (
              <Eye className="cursor-pointer" />
            )}
          </button>
        </div>

        {/* Confirm password (register only) */}
        {!isLogin && (
          <div className="floating relative">
            <input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full px-4 py-2 border rounded"
            />
            <label htmlFor="confirmPassword">Confirm password</label>
            <button
              type="button"
              onClick={toggleShow}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="cursor-pointer" />
              ) : (
                <Eye className="cursor-pointer" />
              )}
            </button>
          </div>
        )}

        {/* Error message */}
        {error && <div className="text-red-600 mb-3">{error}</div>}

        {/* Submit button */}
        <Button
          variant={isLogin ? "blue" : "green"}
          size="lg"
          className="w-full"
          type="submit"
          disabled={loading}
        >
          {loading
            ? isLogin
              ? "Đang đăng nhập..."
              : "Đang đăng ký..."
            : isLogin
            ? "Đăng nhập"
            : "Đăng ký"}
        </Button>
      </form>

      {/* Social login (login only) */}
      {isLogin && (
        <div className="mt-6 space-y-3">
          <button className="w-full flex justify-center py-2 items-center border space-x-2 rounded">
            <img
              src={GOOGLE.src}
              alt={GOOGLE.alt}
              width={GOOGLE.width}
              height={GOOGLE.height}
            />
            <p> Login with Google</p>
          </button>
          <button className="w-full flex justify-center py-2 items-center border space-x-2 rounded">
            <img
              src={FACEBOOK.src}
              alt={FACEBOOK.alt}
              width={FACEBOOK.width}
              height={FACEBOOK.height}
            />
            <p> Login with Facebook</p>
          </button>
        </div>
      )}

      {/* Switch link */}
      <div className="mt-4 text-center text-sm">
        {isLogin ? (
          <span>
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="underline text-[var(--primary-blue-color)]"
            >
              Register
            </Link>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <Link
              to="/login"
              className="underline text-[var(--primary-blue-color)]"
            >
              Login
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
