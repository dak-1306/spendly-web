// filepath: e:\React\spendly\src\components\transaction\TransactionForm.jsx
import React, { useEffect, useState } from "react";
import Button from "../common/Button";

const todayDate = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const defaultIncomeCategories = ["Lương", "Freelance", "Khác"];
const defaultExpenseCategories = [
  "Ăn uống",
  "Di chuyển",
  "Mua sắm",
  "Nhà thuê",
  "Giải trí",
  "Sức khỏe",
  "Giáo dục",
  "Khác",
];

export default function TransactionForm({
  open = false,
  layout = "add",
  role = "expense",
  userId = "",
  initialValues = {},
  categories = [],
  onSubmit = () => {},
  onClose = () => {},
  id = undefined,
}) {
  const isIncome = role === "income";
  const resolvedCategories =
    categories && categories.length > 0
      ? categories
      : isIncome
      ? defaultIncomeCategories
      : defaultExpenseCategories;

  const [form, setForm] = useState({
    userId: "",
    type: role,
    title: "",
    amount: "",
    currency: "VND",
    source: "",
    category: "",
    date: todayDate(),
    month: todayDate().slice(0, 7),
  });

  // Reset form chỉ khi modal mở và initialValues thay đổi
  useEffect(() => {
    if (!open) return;

    const newDate = initialValues?.date ?? todayDate();
    setForm({
      userId: userId || "",
      type: role,
      title: initialValues?.title ?? initialValues?.source ?? "",
      amount: initialValues?.amount ?? "",
      currency: initialValues?.currency ?? "VND",
      source: initialValues?.source ?? "",
      category: initialValues?.category ?? initialValues?.source ?? "",
      date: newDate,
      month: newDate.slice(0, 7),
    });
  }, [open]); // chỉ phụ thuộc vào open, không cần initialValues/role/userId

  // Sync userId/role khi chúng thay đổi mà modal đang mở
  useEffect(() => {
    if (open) {
      setForm((prev) => ({
        ...prev,
        userId: userId || prev.userId,
        type: role,
      }));
    }
  }, [userId, role, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => {
      const next = { ...s, [name]: value };
      if (name === "date") next.month = value ? value.slice(0, 7) : "";
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) return alert("Vui lòng nhập số tiền hợp lệ.");
    const payload = {
      userId: form.userId,
      type: form.type,
      title: form.title,
      amount: amt,
      currency: form.currency,
      source: form.source,
      category: form.category,
      date: form.date,
      month: form.month,
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

      <div className="mb-3 flex gap-3">
        <div className="flex-1">
          <label className="block text-sm mb-1">Tiền tệ</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-300"
          >
            <option value="VND">VND</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm mb-1">
            Nguồn / Đối tượng (source)
          </label>
          <input
            name="source"
            value={form.source}
            onChange={handleChange}
            type="text"
            placeholder="Ví, ngân hàng, người trả..."
            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
        </div>
      </div>

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
