import Button from "../common/Button";
import Input from "../common/Input";
import { Search } from "lucide-react";

export default function FilterExpense({
  expenseCategories = [],
  amountRanges = [],
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
  // Filter labels and placeholders
  const Filter = {
    buttonAll: " Tất cả",
    selectCategory: "Theo loại",
    selectDate: "Theo ngày",
    optionsDate: {
      asc: "Tăng dần",
      desc: "Giảm dần",
    },
    selectAmount: "Theo số tiền",
    searchPlaceholder: "Tìm kiếm chi tiêu...",
  };
  return (
    <div className="flex gap-3 items-center">
      <Button variant="primary" onClick={resetFilters}>
        {Filter.buttonAll}
      </Button>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-2"
      >
        <option value="">{Filter.selectCategory}</option>
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
        <option value="">{Filter.selectDate}</option>
        <option value="asc">{Filter.optionsDate.asc}</option>
        <option value="desc">{Filter.optionsDate.desc}</option>
      </select>

      <select
        value={selectedAmountRange}
        onChange={(e) => setSelectedAmountRange(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md px-3 py-2"
      >
        <option value="">{Filter.selectAmount}</option>
        {amountRanges.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>
      <form className="flex items-center" onSubmit={(e) => e.preventDefault()}>
        <Input
          type="text"
          placeholder={Filter.searchPlaceholder}
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
