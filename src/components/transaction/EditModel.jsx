import React from "react";
import { X } from "lucide-react";
import TransactionForm from "./TransactionForm";

export default function EditModel({
  open = false,
  onClose = () => {},
  role = "expense",
  expense = null,
  onSubmit = () => {},
}) {
  const isIncome = role === "income";

  const deleteIcon = <X className="w-6 h-6 text-white" />;

  const headerBg = isIncome
    ? "bg-[var(--primary-green-color)]"
    : "bg-[var(--primary-blue-color)]";

  if (!open) return null;

  const initialValues = {
    title: expense?.title ?? expense?.source ?? "",
    amount: expense?.amount ?? "",
    date: expense?.date ?? "",
    category: expense?.category ?? expense?.source ?? "",
  };

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
            {deleteIcon}
          </button>
        </div>

        <TransactionForm
          open={open}
          layout="edit"
          role={role}
          initialValues={initialValues}
          onSubmit={onSubmit}
          onClose={onClose}
          id={expense?.id}
        />
      </div>
    </div>
  );
}
