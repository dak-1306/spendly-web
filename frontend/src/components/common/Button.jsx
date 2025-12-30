// 🔧 STYLE DÙNG CHUNG
const baseStyles =
  "inline-flex rounded-lg items-center justify-center font-medium rounded cursor-pointer transition focus:outline-none";

// 🔧 MỖI VARIANT = 1 STYLE
const variantStyles = {
  primary:
    "bg-white text-[var(--primary-blue-color)] hover:bg-blue-200  border border-blue-600",
  secondary: "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300",
  blue: "btn-blue",
  green: "btn-green",
  getStarted: "btn-get-started",
  red: "btn-red",

  edit: "bg-white text-blue-600  hover:bg-blue-50",
  delete: "bg-white text-red-600 hover:bg-red-50",
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
