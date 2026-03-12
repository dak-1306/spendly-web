const newMonth = ({ d }) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export { newMonth };
