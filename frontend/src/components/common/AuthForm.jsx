import { ICONS } from "../../assets/index";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import "../../styles/auth.css";
function AuthForm({ variant = "login" }) {
  const isLogin = variant === "login";
  const LOGO_COLOR = ICONS.logo_color;
  const GOOGLE = ICONS.icon_google;
  const FACEBOOK = ICONS.icon_facebook;
  const EYE = (
    <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
  );

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-8 rounded shadow">
      {/* Logo */}
      <div className="mb-6 text-center">
        {/* 🔧 Thay logo tại đây */}
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

      <form className="space-y-4">
        {/* Name (register only) */}
        {!isLogin && (
          <div className="floating">
            <input
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
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
          />
          <label htmlFor="email">Email</label>
        </div>

        {/* Password */}
        <div className="floating">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
          />

          <label htmlFor="password">Password</label>

          {EYE}
        </div>

        {/* Confirm password (register only) */}
        {!isLogin && (
          <div className="floating">
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-2 border rounded"
            />

            <label htmlFor="confirmPassword">Confirm password</label>
            {EYE}
            
          </div>
        )}

        {/* Submit button */}
        <Button
          variant={isLogin ? "blue" : "green"}
          size="lg"
          className="w-full"
          type="submit"
        >
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </Button>
      </form>

      {/* Social login (login only) */}
      {isLogin && (
        <div className="mt-6 space-y-3">
          <button className="w-full flex justify-center py-2 items-center border space-x-2 rounded">
            {/* 🔧 Thay icon Google */}
            <img
              src={GOOGLE.src}
              alt={GOOGLE.alt}
              width={GOOGLE.width}
              height={GOOGLE.height}
            />
            <p> Login with Google</p>
          </button>
          <button className="w-full flex justify-center py-2 items-center border space-x-2 rounded">
            {/* 🔧 Thay icon Facebook */}
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
