// 🔧 STYLE DÙNG CHUNG
const baseStyles =
  "inline-flex rounded-lg items-center justify-center font-medium rounded cursor-pointer transition focus:outline-none";

// 🔧 MỖI VARIANT = 1 STYLE
const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  loginHeader: "btn-login-header",
  getStarted: "btn-get-started",
  loginForm: "btn-login-form",
  registerForm: "btn-register-form",
};

// 🔧 MỖI SIZE = padding + font-size
const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  variant = "primary", // 🔧 đổi / thêm variant
  size = "md", // 🔧 đổi / thêm size
  isLoading = false, // 🔧 có thể bỏ nếu không cần
  className = "",
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
