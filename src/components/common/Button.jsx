// 🔧 STYLE DÙNG CHUNG
const baseStyles =
  "inline-flex rounded-lg items-center justify-center font-medium rounded cursor-pointer transition focus:outline-none";

// 🔧 MỖI VARIANT = 1 STYLE
const variantStyles = {
  primary:
    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  danger: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  ghost: "text-gray-700 hover:bg-gray-100",
  cta: "bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700",
};

// 🔧 MỖI SIZE = padding + font-size
const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const animation =
  "hover:shadow-lg transition-shadow duration-300 hover:scale-102";

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
        ${animation}
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
