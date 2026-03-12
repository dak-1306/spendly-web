import DeleteConfirm from "../common/DeleteConfirm.jsx";
import { useTransaction } from "../../hooks/useTransaction.js";
import { useCallback } from "react";

export default function DeleteModel({
  open = false,
  onClose = () => {},
  role = "expense", // "expense" | "income"
  item = null,
}) {
  const { deleteTransaction } = useTransaction();
  const isIncome = role === "income";
  const title = item?.title ?? item?.source ?? item?.category ?? "Mục";
  const amount = item?.amount ?? 0;

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteTransaction(item.id);
      onClose();
    } catch (e) {
      alert("Xóa thất bại.");
      console.error(e);
    }
  }, [deleteTransaction, item, onClose]);

  return (
    <DeleteConfirm
      title={`Xóa ${isIncome ? "thu nhập" : "chi tiêu"}`}
      description={`Bạn có chắc chắn muốn xóa ${title} với số tiền ${amount.toLocaleString()} ${item?.currency ?? "VND"} không?`}
      open={open}
      onClose={onClose}
      onConfirm={handleDeleteConfirm}
    />
  );
}
