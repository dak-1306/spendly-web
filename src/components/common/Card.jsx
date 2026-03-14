function Card({ children, className, animation = false }) {
  return (
    <div
      className={`bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 ${className} ${animation ? "hover:shadow-lg transition-shadow duration-300 hover:scale-102 " : ""}`}
    >
      {children}
    </div>
  );
}
export default Card;
