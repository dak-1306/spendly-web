import DeleteConfirm from "../common/DeleteConfirm.jsx";
import { useTransactionStore } from "../../stores/transaction";
import { useCallback } from "react";
import { useLanguage } from "../../hooks/useLanguage.js";

export default function DeleteTransaction({
  open = false,
  onClose = () => {},
  role = "expense", // "expense" | "income"
  item = null,
}) {
  const deleteTransaction = (...args) =>
    useTransactionStore.getState().deleteTransaction(...args);
  const isIncome = role === "income";
  const title = item?.title ?? item?.source ?? item?.category ?? "Mục";
  const amount = item?.amount ?? 0;
  const { t } = useLanguage();

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteTransaction(item.id, undefined, role);
      onClose();
    } catch (e) {
      alert("Xóa thất bại.");
      console.error(e);
    }
  }, [item, onClose, role]);

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
