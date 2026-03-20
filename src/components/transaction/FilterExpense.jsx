import Button from "../common/Button";
import Input from "../common/Input";
import { Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export default function FilterExpense({
  expenseCategories = [],
  amountRanges = [],
  dateSortOptions = [],
  selectedCategory,
  setSelectedCategory,
  dateSort,
  setDateSort,
  selectedAmountRange,
  setSelectedAmountRange,
  resetFilters,
  searchTerm,
  setSearchTerm,
}) {
  const { t } = useLanguage();
  return (
    <div className="flex gap-3 items-center">
      <Button variant="primary" onClick={resetFilters}>
        {t("transactions.buttons.refresh")}
      </Button>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-2"
      >
        <option value="">{t("transactions.filters.categoryExpenses.label")}</option>
        {expenseCategories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={dateSort}
        onChange={(e) => setDateSort(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-2 "
      >
        <option value="">{t("transactions.filters.dateSort.label")}</option>
        {dateSortOptions.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={selectedAmountRange}
        onChange={(e) => setSelectedAmountRange(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-2"
      >
        <option value="">{t("transactions.filters.amountRanges.label")}</option>
        {amountRanges.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>
      <form className="flex items-center" onSubmit={(e) => e.preventDefault()}>
        <Input
          type="text"
          placeholder={t("transactions.placeholderSearch")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" className="ml-2">
          <Search className="w-5 h-5 text-white" />
        </Button>
      </form>
    </div>
  );
}
