import React from "react";
import Button from "../common/Button";
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
  const searchIcon = (
    <Search className="w-5 h-5 text-[var(--primary-blue-color)]" />
  );
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-3 items-center">
        <Button variant="primary" onClick={resetFilters}>
          Tất cả
        </Button>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Theo loại</option>
          {expenseCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={dateSort}
          onChange={(e) => setDateSort(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 "
        >
          <option value="">Theo ngày</option>
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>

        <select
          value={selectedAmountRange}
          onChange={(e) => setSelectedAmountRange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Theo số tiền</option>
          {amountRanges.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <form className="flex items-center" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Tìm kiếm chi tiêu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 ml-auto"
        />
        <Button variant="primary" className="ml-2">
          {searchIcon}
        </Button>
      </form>
    </div>
  );
}
