import Button from "../common/Button";
import Modal from "../common/Modal";
import Input from "../common/Input";

const defaultIncomeCategories = ["Lương", "Freelance", "Khác"];
const defaultCurrency = ["VND", "USD", "EUR", "JPY", "GBP"];
const defaultExpenseCategories = [
  "Ăn uống",
  "Di chuyển",
  "Mua sắm",
  "Nhà thuê",
  "Giải trí",
  "Sức khỏe",
  "Giáo dục",
  "Khác",
];

export default function TransactionForm({
  fields,
  onSubmit,
  onClose,
  isOpen,
  type,
  variant,
}) {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="bg-blue-600 p-4">
        <h2 className="text-xl text-white font-semibold text-center">
          {variant === "add"
            ? type === "income"
              ? "Thêm thu nhập"
              : "Thêm chi tiêu"
            : type === "income"
              ? "Chỉnh sửa thu nhập"
              : "Chỉnh sửa chi tiêu"}
        </h2>
      </div>
      <form onSubmit={onSubmit} className="p-4">
        {/* Các trường nhập liệu */}
        {fields.map((field) => (
          <div key={field.name} className="mb-4">
            {field.type === "select" && field.name === "category" ? (
              <select
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">-- Chọn {field.label} --</option>
                {(field.name === "category" && type === "income"
                  ? defaultIncomeCategories
                  : defaultExpenseCategories
                ).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "select" && field.name === "currency" ? (
              <select
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">-- Chọn {field.label} --</option>
                {defaultCurrency.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                label={field.label}
                type={field.type}
                name={field.name}
                placeholder={field.label}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          </div>
        ))}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button type="submit" variant="primary" className="w-full">
            Lưu
          </Button>
        </div>
      </form>
    </Modal>
  );
}
