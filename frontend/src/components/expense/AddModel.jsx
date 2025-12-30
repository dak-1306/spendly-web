import React, { useEffect, useState } from "react";
import Button from "../common/Button";
import { ICONS } from "../../assets/index";

const incomeCategories = ["Salary", "Freelance", "Other"];
const expenseCategories = ["Food", "Transport", "Shopping", "Rent", "Other"];

export default function AddModel({
  open = false,
  onClose = () => {},
  role = "expense",
  onSubmit = () => {},
}) {
  const isIncome = role === "income";
  const headerColor = isIncome ? "bg-green-600" : "bg-blue-600";

  const deleteIcon = ICONS.icon_delete;

  const todayDate = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };

  const [form, setForm] = useState({
    amount: "",
    date: todayDate(),
    category: "",
    title: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        amount: "",
        date: todayDate(),
        category: "",
        title: "",
      });
    }
  }, [open, role]);

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
    };
    onSubmit(payload);
    onClose();
  };

  if (!open) return null;

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
          className={`${headerColor} flex justify-between items-center p-4 text-white`}
        >
          <strong className="text-base">
            {isIncome ? "Thêm thu nhập" : "Thêm chi tiêu"}
          </strong>
          <button
            onClick={onClose}
            aria-label="Close"
            className="bg-transparent border-0 text-white text-xl leading-none"
          >
            {deleteIcon && (
              <img
                src={deleteIcon.src}
                alt={deleteIcon.alt}
                width={deleteIcon.width}
                height={deleteIcon.height}
              />
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
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

          <div className="mb-3 flex gap-3">
            <div className="flex-1">
              <label className="block text-sm mb-1">Ngày</label>
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                type="date"
                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-300"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm mb-1">Danh mục</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-300"
              >
                <option value="">
                  {isIncome ? "Chọn danh mục thu" : "Chọn danh mục chi"}
                </option>
                {(isIncome ? incomeCategories : expenseCategories).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
