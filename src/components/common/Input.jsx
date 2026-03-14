function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200 ${className}`}
      />
    </div>
  );
}

export default Input;
