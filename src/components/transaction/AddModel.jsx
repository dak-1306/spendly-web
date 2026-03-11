import TransactionForm from "./TransactionForm";
import useTransaction from "../../hooks/useTransaction";
import { useCallback, useState } from "react";

export default function AddModel({ open = false, onClose = () => {}, role }) {
  const { addTransaction } = useTransaction();
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

  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setField((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  console.log("AddModel field state:", field);
  const handleAddExpenseSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formPayload = { ...field, type: role };
      try {
        console.log("Submitting form with payload:", formPayload);
        await addTransaction(formPayload);
        onClose();
      } catch (err) {
        alert("Thêm chi tiêu thất bại.");
        console.error(err);
      }
    },
    [addTransaction, field, onClose, role],
  );

  const handleAddIncomeSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formPayload = { ...field, type: role };
      try {
        console.log("Submitting income with payload:", formPayload);
        await addTransaction(formPayload);
        onClose();
      } catch (err) {
        alert("Thêm thu nhập thất bại.");
        console.error(err);
      }
    },
    [addTransaction, field, onClose, role],
  );

  const handleSubmit =
    role === "income" ? handleAddIncomeSubmit : handleAddExpenseSubmit;
  const fields = [
    {
      name: "title",
      label: role === "income" ? "Nguồn thu" : "Mục chi",
      value: title,
      type: "text",
      onChange: handleFieldChange("title"),
    },
    {
      name: "source",
      label: "Nguồn",
      value: source,
      type: "text",
      onChange: handleFieldChange("source"),
    },
    {
      name: "amount",
      label: "Số tiền",
      type: "number",
      value: amount,
      onChange: handleFieldChange("amount"),
    },
    {
      name: "currency",
      label: "Loại tiền",
      type: "select",
      value: currency,
      onChange: handleFieldChange("currency"),
    },
    {
      name: "category",
      label: "Danh mục",
      type: "select",
      value: category,
      onChange: handleFieldChange("category"),
    },
    {
      name: "date",
      label: "Ngày giao dịch",
      type: "date",
      value: date,
      onChange: handleFieldChange("date"),
    },
    {
      name: "month",
      label: "Tháng",
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
