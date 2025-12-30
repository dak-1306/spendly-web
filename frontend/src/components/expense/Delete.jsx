import React from "react";
import Button from "../common/Button";
import { ICONS } from "../../assets/index";

export default function DeleteModel({
  open = false,
  onClose = () => {},
  role = "expense", // "expense" | "income"
  item = null,
  onConfirm = () => {},
}) {
  if (!open) return null;

  const deleteIcon = ICONS.icon_delete;

  const isIncome = role === "income";
  const title = item?.title ?? item?.source ?? item?.category ?? "Mục";
  const amount = item?.amount ?? 0;

  const handleConfirm = () => {
    onConfirm({ id: item?.id, role });
    onClose();
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
        className="w-[420px] rounded-lg bg-white shadow-lg overflow-hidden"
      >
        <div
          className={`${
            isIncome ? "bg-green-600" : "bg-blue-600"
          } p-4 text-white flex justify-between items-center`}
        >
          <strong className="text-base">
            Xóa {isIncome ? "thu nhập" : "chi tiêu"}
          </strong>
          <button
            onClick={onClose}
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

        <div className="p-4">
          <p className="mb-4 text-sm text-gray-700">
            Bạn có chắc muốn xóa <span className="font-medium">{title}</span>
            {amount ? (
              <>
                {" "}
                —{" "}
                <span className="font-semibold text-red-600">
                  {Number(amount).toLocaleString()} VND
                </span>
              </>
            ) : null}
            ?
          </p>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="button" variant="red" onClick={handleConfirm}>
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
