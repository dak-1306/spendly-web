import React from "react";
import Button from "./Button";

export default function DeleteConfirm({
  open = false,
  onClose = () => {},
  title = "Xác nhận",
  description = "",
  confirmLabel = "Xác nhận",
  confirmVariant = "red",
  onConfirm = () => {},
}) {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        <div className="p-4">
          {description && (
            <p className="mb-4 text-sm text-gray-700">{description}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="button"
              variant={confirmVariant}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
