import { useState, useEffect, useMemo, useCallback } from "react";
import { useTransaction } from "../../hooks/useTransaction.js";
import { useLanguage } from "../../hooks/useLanguage.js";
import { useAuth } from "../../hooks/useAuth.js";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import LineColor from "../../components/common/LineColor.jsx";
import FilterExpense from "../../components/transaction/FilterExpense.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import AddTransaction from "../../components/transaction/AddTransaction.jsx";
import EditTransaction from "../../components/transaction/EditTransaction.jsx";
import DeleteTransaction from "../../components/transaction/DeleteTransaction.jsx";
import { Edit2, Trash2, Eye } from "lucide-react";
import { formatForInputDate, formatForDisplay } from "../../utils/financial.js";
import { Link } from "react-router-dom";

import SkeletonTransaction from "../../components/transaction/SkeletonTransaction.jsx";

export default function ExpensePage() {
  const { expenses, month, GetExpense, loading, error } = useTransaction();
  const { user } = useAuth();
  const userId = user?.uid;
  const { t } = useLanguage();

  const expenseCategories = t("transactions.filters.categoryExpenses.options");
  const amountRanges = t("transactions.filters.amountRanges.options");
  const dateSortOptions = t("transactions.filters.dateSort.options");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateSort, setDateSort] = useState("");
  const [selectedAmountRange, setSelectedAmountRange] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [cursorExpense, setCursorExpense] = useState(null);
  const [cursorStackExpense, setCursorStackExpense] = useState([]);
  const itemsPerPage = 5;

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { nextCursor } = await GetExpense(
        userId,
        {
          category: selectedCategory || null,
          amountRange: selectedAmountRange || null,
          sortBy: dateSort || null,
          searchTerm: searchTerm || null,
        },
        {
          limit: itemsPerPage,
          cursor: null,
        },
      );
      if (!mounted) return;
      setCursorExpense(nextCursor);
      setCursorStackExpense([]);
    };
    load();
    return () => (mounted = false);
  }, [
    userId,
    month,
    selectedCategory,
    selectedAmountRange,
    dateSort,
    searchTerm,
    GetExpense,
  ]);

  const resultExpenses = useMemo(() => {
    if (expenses?.results) {
      return expenses.results.map((expense) => ({
        ...expense,
        date: formatForInputDate(expense.date),
      }));
    }
    return [];
  }, [expenses]);

  const onNext = async () => {
    const filters = {
      category: selectedCategory || null,
      amountRange: selectedAmountRange || null,
      sortBy: dateSort || null,
      searchTerm: searchTerm || null,
    };
    const res = await GetExpense(userId, filters, {
      limit: itemsPerPage,
      cursor: cursorExpense,
    });
    if (res?.nextCursor) {
      setCursorStackExpense((prev) => [...prev, cursorExpense]);
      setCursorExpense(res.nextCursor);
    }
  };

  const onPrev = async () => {
    const filters = {
      category: selectedCategory || null,
      amountRange: selectedAmountRange || null,
      sortBy: dateSort || null,
      searchTerm: searchTerm || null,
    };
    if (cursorStackExpense.length === 0) {
      const res = await GetExpense(userId, filters, {
        limit: itemsPerPage,
        cursor: null,
      });
      setCursorStackExpense([]);
      setCursorExpense(res?.nextCursor ?? null);
      return;
    }
    const newStack = cursorStackExpense.slice(0, -1);
    const newTop = newStack.length ? newStack[newStack.length - 1] : null;
    setCursorStackExpense(newStack);
    const res = await GetExpense(userId, filters, {
      limit: itemsPerPage,
      cursor: newTop,
    });
    setCursorExpense(res?.nextCursor ?? null);
  };

  const openEdit = useCallback((expense) => {
    setEditingExpense(expense);
    setIsEditOpen(true);
  }, []);

  const openDelete = useCallback((item) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategory("");
    setDateSort("");
    setSelectedAmountRange("");
    setSearchTerm("");
  }, []);

  const editIcon = (
    <Edit2 className="text-blue-600 dark:text-blue-400" size={16} />
  );
  const trashIcon = (
    <Trash2 className="text-red-600 dark:text-red-400" size={16} />
  );
  const eyeIcon = (
    <Eye className="text-gray-600 dark:text-gray-400" size={16} />
  );

  if (error) {
    return (
      <Card className="border-l-4 border-red-500 bg-red-50 text-red-700">
        Lỗi tải dữ liệu: {String(error)}
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 space-x-4">
        <FilterExpense
          expenseCategories={expenseCategories}
          amountRanges={amountRanges}
          dateSortOptions={dateSortOptions}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          dateSort={dateSort}
          setDateSort={setDateSort}
          selectedAmountRange={selectedAmountRange}
          setSelectedAmountRange={setSelectedAmountRange}
          resetFilters={resetFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <Button
          size="md"
          variant="primary"
          onClick={() => setIsAddExpenseOpen(true)}
        >
          {t("transactions.buttons.addExpense")}
        </Button>
      </div>
      <LineColor />
      <div className="overflow-x-auto">
        <table className="w-full mt-4 table-auto">
          <thead>
            <tr className="text-left border-b border-gray-300">
              <th className="px-4 py-2">
                {t("transactions.tableHeaders.category", "Danh mục")}
              </th>
              <th className="px-4 py-2">
                {t("transactions.tableHeaders.title", "Tiêu đề")}
              </th>
              <th className="px-4 py-2">
                {t("transactions.tableHeaders.date", "Ngày")}
              </th>
              <th className="px-4 py-2">
                {t("transactions.tableHeaders.amount", "Số tiền")}
              </th>
              <th className="px-4 py-2">
                {t("transactions.tableHeaders.actions", "Hành động")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4">
                  <SkeletonTransaction view="table" />
                </td>
              </tr>
            ) : (

              resultExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-4">{expense.category}</td>
                  <td className="px-4 py-4">{expense.title}</td>
                  <td className="px-4 py-4">
                    {formatForDisplay(expense.date)}
                  </td>
                  <td className="px-4 py-4 font-semibold text-red-600">
                    {expense.amount?.toLocaleString() ?? 0}{" "}
                    {expense.currency ?? "VND"}
                  </td>
                  <td className="px-4 py-4 flex gap-2">
                    <Button variant="ghost" onClick={() => openEdit(expense)}>
                      {editIcon}
                    </Button>
                    <Button variant="ghost" onClick={() => openDelete(expense)}>
                      {trashIcon}
                    </Button>
                    <Link to={`/transaction/${expense.id}`}>
                      <Button variant="ghost">{eyeIcon}</Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>
      <Pagination
        onPrev={onPrev}
        onNext={onNext}
        hasNext={resultExpenses.length === itemsPerPage}
      />

      {isAddExpenseOpen && (
        <AddTransaction
          open={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          role="expense"
        />
      )}
      {isEditOpen && editingExpense && (
        <EditTransaction
          open={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingExpense(null);
          }}
          role="expense"
          data={editingExpense}
        />
      )}
      {isDeleteOpen && deletingItem && (
        <DeleteTransaction
          open={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeletingItem(null);
          }}
          role="expense"
          item={deletingItem}
        />
      )}
    </Card>
  );
}
