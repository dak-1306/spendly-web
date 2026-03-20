import DeleteConfirm from "../common/DeleteConfirm.jsx";
import { useTransaction } from "../../hooks/useTransaction.js";
import { useCallback } from "react";
import { useLanguage } from "../../hooks/useLanguage.js";

export default function DeleteTransaction({
  open = false,
  onClose = () => {},
  role = "expense", // "expense" | "income"
  item = null,
}) {
  const { deleteTransaction } = useTransaction();
  const isIncome = role === "income";
  const title = item?.title ?? item?.source ?? item?.category ?? "Mục";
  const amount = item?.amount ?? 0;
  const { t } = useLanguage();

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
      title={`${isIncome ? t("transactions.formDelete.titleIncome") : t("transactions.formDelete.titleExpense")}`}
      description={`${t("transactions.formDelete.message")} ${title} / ${amount.toLocaleString()} ${item?.currency ?? "VND"}?`}
      open={open}
      onClose={onClose}
      onConfirm={handleDeleteConfirm}
    />
  );
}
