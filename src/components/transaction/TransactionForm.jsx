import Button from "../common/Button";
import Modal from "../common/Modal";
import Input from "../common/Input";

import { useLanguage } from "../../hooks/useLanguage";

export default function TransactionForm({
  fields,
  onSubmit,
  onClose,
  isOpen,
  type,
  variant,
}) {
  const { t } = useLanguage();
  const defaultExpenseCategories = t(
    "transactions.filters.categoryExpenses.options",
  );
  const defaultIncomeCategories = t(
    "transactions.filters.categoryIncomes.options",
  );
  const defaultCurrency = t("setting.uiSettings.currency.options");
  console.log(
    "🚀 ~ file: TransactionForm.jsx:17 ~ TransactionForm ~ defaultCurrency:",
    defaultCurrency,
  );
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="bg-blue-600 p-4">
        <h2 className="text-xl text-white font-semibold text-center">
          {variant === "add"
            ? type === "income"
              ? t("transactions.titleAddIncome")
              : t("transactions.titleAddExpense")
            : type === "income"
              ? t("transactions.titleEditIncome")
              : t("transactions.titleEditExpense")}
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
                <option value="">-- {field.label} --</option>
                {(field.name === "category" && type === "income"
                  ? defaultIncomeCategories
                  : defaultExpenseCategories
                ).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                <option value="">-- {field.label} --</option>
                {defaultCurrency.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
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
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="primary" className="w-full">
            {t("common.confirm")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
