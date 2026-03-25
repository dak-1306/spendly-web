function Card({ children, className = "", animation = false }) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-700
        shadow-md rounded-lg p-6
        ${animation ? `
          transition-all duration-300 ease-out
          hover:shadow-xl
          hover:-translate-y-1
          hover:scale-[1.02]
          cursor-pointer
        ` : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;