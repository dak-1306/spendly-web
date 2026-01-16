import React from "react";
import { X } from "lucide-react";
import TransactionForm from "./TransactionForm";

export default function AddModel({
  open = false,
  onClose = () => {},
  role = "expense",
  onSubmit = () => {},
}) {
  const isIncome = role === "income";
  const headerColor = isIncome ? "bg-green-600" : "bg-blue-600";

  const deleteIcon = <X className="w-6 h-6 text-white" />;

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
            {deleteIcon}
          </button>
        </div>

        <TransactionForm
          open={open}
          layout="add"
          role={role}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
