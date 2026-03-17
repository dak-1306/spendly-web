import TransactionForm from "./TransactionForm";
import { useTransaction } from "../../hooks/useTransaction";
import { useState, useEffect } from "react";
export default function EditTransaction({
  open = false,
  onClose = () => {},
  role = "expense",
  data = null,
}) {
  const isIncome = role === "income";
  const [field, setField] = useState({
    title: "",
    amount: 0,
    source: "",
    currency: "",
    category: "",
    date: "",
    month: "",
  });

  useEffect(() => {
    if (data) {
      setField({
        title: data.title || "",
        amount: data.amount || 0,
        currency: data.currency || "",
        category: data.category || "",
        date: data.date || "",
        source: data.source || "",
        month: data.month || "",
      });
    } else {
      setField({
        title: "",
        amount: 0,
        currency: "",
        category: "",
        date: "",
        source: "",
        month: "",
      });
    }
  }, [data]);

  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setField((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const { updateTransaction } = useTransaction();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = {
        ...field,
        type: role,
      };

      await updateTransaction(data.id, formPayload);
      onClose();
    } catch (e) {
      alert("Cập nhật thất bại.");
      console.error(e);
    } finally {
      setField({
        title: "",
        amount: 0,
        currency: "",
        category: "",
        date: "",
        source: "",
        month: "",
      });
    }
  };

  const fields = [
    {
      name: "title",
      label: isIncome ? "Nguồn thu" : "Mục chi",
      type: "text",
      value: field.title,
      onChange: handleFieldChange("title"),
    },
    {
      name: "amount",
      label: "Số tiền",
      type: "number",
      value: field.amount,
      onChange: handleFieldChange("amount"),
    },
    {
      name: "source",
      label: "Nguồn",
      type: "text",
      value: field.source,
      onChange: handleFieldChange("source"),
    },
    {
      name: "date",
      label: "Ngày",
      type: "date",
      value: field.date,
      onChange: handleFieldChange("date"),
    },
    {
      name: "category",
      label: "Danh mục",
      type: "select",
      value: field.category,
      onChange: handleFieldChange("category"),
    },
    {
      name: "currency",
      label: "Loại tiền",
      type: "select",
      value: field.currency,
      onChange: handleFieldChange("currency"),
    },

    {
      name: "month",
      label: "Tháng",
      type: "text",
      value: field.month,
      onChange: handleFieldChange("month"),
    },
  ];
  console.log("Initial values for form fields:", field);

  return (
    <TransactionForm
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      isOpen={open}
      type={role}
      variant="edit"
    />
  );
}
