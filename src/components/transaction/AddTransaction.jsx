import TransactionForm from "./TransactionForm";
import { useTransaction } from "../../hooks/useTransaction";
import { useCallback, useState } from "react";

export default function AddTransaction({ open = false, onClose = () => {}, role }) {
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
        await addTransaction(formPayload);
        onClose();
      } catch (err) {
        alert("Thêm giao dịch thất bại.");
        console.error(err);
      }
    },
    [addTransaction, field, onClose, role],
  );

  const fields = [
    {
      name: "title",
      label: "Tiêu đề",
      value: title,
      type: "text",
      onChange: handleFieldChange("title"),
    },
    {
      name: "source",
      label: role === "income" ? "Nguồn thu nhập" : "Mô tả chi tiêu",
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
