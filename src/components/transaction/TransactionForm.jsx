// filepath: e:\React\spendly\src\components\transaction\TransactionForm.jsx
import React, { useEffect, useState } from "react";
import Button from "../common/Button";

const todayDate = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

// thêm mặc định categories ở đây
const defaultIncomeCategories = ["Lương", "Freelance", "Khác"];
const defaultExpenseCategories = [
  "Ăn uống",
  "Di chuyển",
  "Mua sắm",
  "Nhà thuê",
  "Khác",
];

export default function TransactionForm({
  open = false,
  layout = "add", // "add" | "edit"
  role = "expense", // "expense" | "income"
  initialValues = {},
  categories = [], // nếu không truyền sẽ dùng mặc định bên dưới
  onSubmit = () => {},
  onClose = () => {},
  id = undefined,
}) {
  const isIncome = role === "income";
  // dùng prop categories nếu có, ngược lại lấy mặc định theo role
  const resolvedCategories =
    categories && categories.length > 0
      ? categories
      : isIncome
      ? defaultIncomeCategories
      : defaultExpenseCategories;

  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: todayDate(),
    category: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        title: initialValues?.title ?? initialValues?.source ?? "",
        amount: initialValues?.amount ?? "",
        date: initialValues?.date ?? todayDate(),
        category: initialValues?.category ?? initialValues?.source ?? "",
      });
    }
  }, [open, initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) return alert("Vui lòng nhập số tiền hợp lệ.");
    const payload = {
      ...form,
      amount: amt,
      role,
      id,
    };
    onSubmit(payload);
    onClose();
  };

  if (!open) return null;

  const submitVariant = isIncome ? "green" : "blue";

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {layout === "edit" && (
        <div className="mb-3">
          <label className="block text-sm mb-1">Tiêu đề</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            type="text"
            placeholder="Tiêu đề..."
            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-300"
            autoFocus
          />
        </div>
      )}

      {layout === "add" && (
        <div className="mb-3">
          <label className="block text-sm mb-1">Số tiền</label>
          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-300"
            autoFocus
          />
        </div>
      )}

      {layout === "edit" && (
        <div className="mb-3">
          <label className="block text-sm mb-1">Số tiền</label>
          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
        </div>
      )}

      <div className={`mb-3 ${layout === "add" ? "flex gap-3" : ""}`}>
        <div className={layout === "add" ? "flex-1" : ""}>
          <label className="block text-sm mb-1">Ngày</label>
          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            type="date"
            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
        </div>

        <div className={layout === "add" ? "flex-1" : "mt-0"}>
          <label className="block text-sm mb-1">Danh mục</label>

          {layout === "edit" ? (
            <div className="mb-4 flex gap-3">
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                type="text"
                placeholder={isIncome ? "Danh mục thu" : "Danh mục chi"}
                className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-300"
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="flex-1 px-3 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-300"
              >
                <option value="">
                  {isIncome ? "Chọn danh mục thu" : "Chọn danh mục chi"}
                </option>
                {resolvedCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-300"
            >
              <option value="">
                {isIncome ? "Chọn danh mục thu" : "Chọn danh mục chi"}
              </option>
              {resolvedCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {layout === "add" && (
        <div className="mb-4">
          <label className="block text-sm mb-1">Tiêu đề</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            type="text"
            placeholder="Mô tả ngắn..."
            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="red" onClick={onClose}>
          Hủy
        </Button>
        <Button type="submit" variant={submitVariant}>
          Lưu
        </Button>
      </div>
    </form>
  );
}
