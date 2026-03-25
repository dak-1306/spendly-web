// 🔧 BASE STYLE
const baseStyles =
  "inline-flex items-center justify-center whitespace-nowrap font-medium rounded-lg cursor-pointer select-none " +
  "transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

// 🔧 VARIANTS
const variantStyles = {
  primary:
    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white " +
    "hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500",

  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400",

  danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",

  outline:
    "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-400",

  ghost:
    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600",

  cta:
    "bg-gradient-to-r from-yellow-500 to-orange-600 text-white " +
    "hover:from-yellow-600 hover:to-orange-700 focus:ring-orange-400",
};

// 🔧 SIZE
const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

// 🔧 ANIMATION
const animation =
  "hover:-translate-y-[1px] hover:shadow-lg active:translate-y-[1px] active:shadow-md";

// 🔧 COMPONENT
const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
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
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Loading
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
