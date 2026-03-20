import TransactionForm from "./TransactionForm";
import { useTransaction } from "../../hooks/useTransaction";
import { useLanguage } from "../../hooks/useLanguage";
import {useAuth} from "../../hooks/useAuth.js";
import { useCallback, useState } from "react";


export default function AddTransaction({
  open = false,
  onClose = () => {},
  role,
}) {
  const { addTransaction } = useTransaction();
  const { user } = useAuth();
  const userId = user?.uid;
  const [field, setField] = useState({
    title: "",
    amount: "",
    source: "",
    currency: "",
    category: "",
    date: "",
    month: "",
  });
  const { title, amount, source, currency, category, date, month } = field;
  const { t } = useLanguage();

  // Hàm xử lý thay đổi giá trị của các trường input
  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setField((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  console.log("AddModel field state:", field);

  // Hàm xử lý submit form thêm giao dịch
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formPayload = { ...field, type: role };
      try {
        console.log("Submitting form with payload:", formPayload);
        await addTransaction(userId, formPayload);
        onClose();
      } catch (err) {
        alert("Thêm giao dịch thất bại.");
        console.error(err);
      }
    },
    [addTransaction, field, onClose, role, userId],
  );

  const fields = [
    {
      name: "title",
      label: t("transactions.fields.title"),
      value: title,
      type: "text",
      onChange: handleFieldChange("title"),
    },
    {
      name: "source",
      label:
        role === "income"
          ? t("transactions.fields.sourceIncome")
          : t("transactions.fields.sourceExpense"),
      value: source,
      type: "text",
      onChange: handleFieldChange("source"),
    },
    {
      name: "amount",
      label: t("transactions.fields.amount"),
      type: "number",
      value: amount,
      onChange: handleFieldChange("amount"),
    },
    {
      name: "currency",
      label: t("transactions.fields.currency"),
      type: "select",
      value: currency,
      onChange: handleFieldChange("currency"),
    },
    {
      name: "category",
      label: t("transactions.fields.category"),
      type: "select",
      value: category,
      onChange: handleFieldChange("category"),
    },
    {
      name: "date",
      label: t("transactions.fields.date"),
      type: "date",
      value: date,
      onChange: handleFieldChange("date"),
    },
    {
      name: "month",
      label: t("transactions.fields.month"),
      type: "month",
      value: month,
      onChange: handleFieldChange("month"),
    },
  ];
  return (
    <TransactionForm
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      isOpen={open}
      type={role}
      variant="add"
    />
  );
}
