import { ICONS } from "../../assets/index";
import { Eye, EyeOff, House } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import "../../styles/auth.css";
import { useState } from "react";

import { useLanguage } from "../../hooks/useLanguage";

function AuthForm({
  fields,
  variant = "login",
  handleSubmit,
  handleGoogle,
  error,
  loading,
}) {
  const LOGO_COLOR = ICONS.logo_color;
  const GOOGLE = ICONS.icon_google;
  const FACEBOOK = ICONS.icon_facebook;

  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  const toggleShow = () => setShowPassword((s) => !s);

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-8 rounded shadow">
      {/* Logo */}
      <div className="mb-6 text-center">
        <div className={`text-2xl font-bold text-blue-600`}>
          <img
            src={LOGO_COLOR.src}
            alt={LOGO_COLOR.alt}
            width={LOGO_COLOR.width}
            height={LOGO_COLOR.height}
            className="mx-auto"
          />
          {variant === "login"
            ? t("auth.login.loginTitle")
            : t("auth.register.registerTitle")}
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {fields.map((field, idx) => (
          <div key={idx}>
            {field.type !== "password" ? (
              <div className="floating relative">
                <input
                  id={field.label.toLowerCase()}
                  value={field.value}
                  onChange={field.onChange}
                  type={field.type}
                  placeholder={field.label}
                  className="w-full px-4 py-2 border rounded"
                />
                <label htmlFor={field.label.toLowerCase()}>{field.label}</label>
              </div>
            ) : (
              <div className="floating relative">
                <input
                  id={field.label.toLowerCase()}
                  value={field.value}
                  onChange={field.onChange}
                  type={showPassword ? "text" : "password"}
                  placeholder={field.label}
                  className="w-full px-4 py-2 border rounded"
                />
                <label htmlFor={field.label.toLowerCase()}>{field.label}</label>
                <button
                  type="button"
                  onClick={toggleShow}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
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
          </div>
        ))}

        {/* Error message */}
        {error && <div className="text-red-600 mb-3">{error}</div>}

        {/* Submit button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          type="submit"
          disabled={loading}
        >
          {loading
            ? variant === "login"
              ? t("auth.login.loadingLogin")
              : t("auth.register.loadingRegister")
            : variant === "login"
              ? t("auth.login.loginButton")
              : t("auth.register.registerButton")}
        </Button>
      </form>

      {/* Social login (login only) */}
      {variant === "login" && (
        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            className="w-full flex justify-center py-2 items-center border space-x-2 rounded cursor-pointer"
            disabled={loading}
          >
            <img
              src={GOOGLE.src}
              alt={GOOGLE.alt}
              width={GOOGLE.width}
              height={GOOGLE.height}
            />
            <p>{t("auth.login.loginWithGoogle")}</p>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full flex justify-center py-2 items-center border space-x-2 rounded cursor-pointer"
            disabled={loading}
          >
            <img
              src={FACEBOOK.src}
              alt={FACEBOOK.alt}
              width={FACEBOOK.width}
              height={FACEBOOK.height}
            />
            <p>{t("auth.login.loginWithFacebook")}</p>
          </Button>
        </div>
      )}

      {/* Switch link */}
      <div className="mt-4 text-center text-sm">
        {variant === "login" ? (
          <span>
            {t("auth.login.noAccount")}
            <Link to="/register" className="underline text-blue-600">
              {t("auth.login.registerLink")}
            </Link>
          </span>
        ) : (
          <span>
            {t("auth.register.haveAccount")}
            <Link to="/login" className="underline text-blue-600">
              {t("auth.register.loginLink")}
            </Link>
          </span>
        )}
      </div>
      <div className="flex justify-center">
        <Link to="/">
          <Button type="button" variant="ghost">
            <House className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default AuthForm;
