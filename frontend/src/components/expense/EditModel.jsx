import React, { useEffect, useState } from "react";
import Button from "../common/Button";
import { ICONS } from "../../assets/index";

const incomeCategories = ["Lương", "Freelance", "Khác"];
const expenseCategories = [
  "Ăn uống",
  "Di chuyển",
  "Mua sắm",
  "Nhà thuê",
  "Khác",
];

export default function EditModel({
  open = false,
  onClose = () => {},
  role = "expense",
  expense = null,
  onSubmit = () => {},
}) {
  const isIncome = role === "income";

  const deleteIcon = ICONS.icon_delete;

  const todayDate = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };

  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: todayDate(),
    category: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        // for expense: use expense.category; for income: use expense.source
        title: expense?.title ?? expense?.source ?? "",
        amount: expense?.amount ?? "",
        date: expense?.date ?? todayDate(),
        category: expense?.category ?? expense?.source ?? "",
      });
    }
  }, [open, expense, role]);

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
      id: expense?.id,
    };
    onSubmit(payload);
    onClose();
  };

  if (!open) return null;

  const categories = isIncome ? incomeCategories : expenseCategories;
  const headerBg = isIncome
    ? "bg-[var(--primary-green-color)]"
    : "bg-[var(--primary-blue-color)]";

  return (
    <div
      aria-modal="true"
      role="dialog"
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[500px] rounded-lg bg-white shadow-lg overflow-hidden"
      >
        <div
          className={`${headerBg} flex justify-between items-center p-4 text-white`}
        >
          <strong className="text-base">
            {isIncome ? "Chỉnh sửa thu nhập" : "Chỉnh sửa chi tiêu"}
          </strong>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white text-xl leading-none bg-transparent border-0"
          >
            {deleteIcon ? (
              <img
                src={deleteIcon.src}
                alt={deleteIcon.alt}
                width={deleteIcon.width}
                height={deleteIcon.height}
              />
            ) : (
              "×"
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
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

          <div className="mb-3">
            <label className="block text-sm mb-1">Ngày</label>
            <input
              name="date"
              value={form.date}
              onChange={handleChange}
              type="date"
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-300"
            />
          </div>

          {/* Danh mục: 1 hàng chiếm full width, trái 1/2 editable, phải 1/2 select */}
          <div className="mb-4 flex gap-3">
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              type="text"
              placeholder={
                expense?.category ||
                expense?.source ||
                (isIncome ? "Danh mục thu" : "Danh mục chi")
              }
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
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="red" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant={isIncome ? "green" : "blue"}>
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
