import { useState, useEffect, useMemo, useCallback } from "react";
import { useTransactionStore } from "../../stores/transaction";
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
import SkeletonExpense from "../../components/transaction/SkeletonExpense.jsx";
import { motion as Motion } from "framer-motion";
import { container, item } from "../../motion.config";

export default function ExpensePage() {
  const expenses = useTransactionStore((s) => s.expenses);
  const month = useTransactionStore((s) => s.month);
  const loading = useTransactionStore((s) => s.loadingFlags.fetchExpenses);
  const error = useTransactionStore((s) => s.error);
  const { user } = useAuth();
  const { t } = useLanguage();

  const userId = user?.uid;
  const itemsPerPage = 5;

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateSort, setDateSort] = useState("");
  const [selectedAmountRange, setSelectedAmountRange] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination cursor
  const [cursorExpense, setCursorExpense] = useState(null);
  const [cursorStackExpense, setCursorStackExpense] = useState([]);

  // Modal states
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  // Filter object memo
  const filters = useMemo(
    () => ({
      category: selectedCategory || null,
      amountRange: selectedAmountRange || null,
      sortBy: dateSort || null,
      searchTerm: searchTerm || null,
    }),
    [selectedCategory, selectedAmountRange, dateSort, searchTerm],
  );

  // Fetch expenses
  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      const { fetchExpenses } = useTransactionStore.getState();
      const { nextCursor } = await fetchExpenses(userId, filters, {
        limit: itemsPerPage,
        cursor: null,
      });

      setCursorExpense(nextCursor);
      setCursorStackExpense([]);
    };

    load();
  }, [userId, month, filters]);

  // Format results
  const resultExpenses = useMemo(() => {
    if (!expenses?.results) return [];
    return expenses.results.map((expense) => ({
      ...expense,
      date: formatForInputDate(expense.date),
    }));
  }, [expenses]);

  // Pagination
  const onNext = async () => {
    const { fetchExpenses } = useTransactionStore.getState();
    const res = await fetchExpenses(userId, filters, {
      limit: itemsPerPage,
      cursor: cursorExpense,
    });

    if (res?.nextCursor) {
      setCursorStackExpense((prev) => [...prev, cursorExpense]);
      setCursorExpense(res.nextCursor);
    }
  };

  const onPrev = async () => {
    if (cursorStackExpense.length === 0) {
      const { fetchExpenses } = useTransactionStore.getState();
      const res = await fetchExpenses(userId, filters, {
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
    const { fetchExpenses } = useTransactionStore.getState();
    const res = await fetchExpenses(userId, filters, {
      limit: itemsPerPage,
      cursor: newTop,
    });

    setCursorExpense(res?.nextCursor ?? null);
  };

  // Handlers
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

  // Loading & Error
  if (loading && !expenses) return <SkeletonExpense />;

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
          expenseCategories={t("transactions.filters.categoryExpenses.options")}
          amountRanges={t("transactions.filters.amountRanges.options")}
          dateSortOptions={t("transactions.filters.dateSort.options")}
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

        <Button onClick={() => setIsAddExpenseOpen(true)}>
          {t("transactions.buttons.addExpense")}
        </Button>
      </div>

      <LineColor />

      <Motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="overflow-x-auto"
      >
        <table className="w-full mt-4 table-auto">
          <thead>
            <tr className="text-left border-b border-gray-300">
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {resultExpenses.map((expense) => (
              <Motion.tr
                variants={item}
                key={expense.id}
                className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-4">{expense.category}</td>
                <td className="px-4 py-4">{expense.title}</td>
                <td className="px-4 py-4">{formatForDisplay(expense.date)}</td>
                <td className="px-4 py-4 font-semibold text-red-600">
                  {expense.amount?.toLocaleString()} {expense.currency ?? "VND"}
                </td>
                <td className="px-4 py-4 flex gap-2">
                  <Button variant="ghost" onClick={() => openEdit(expense)}>
                    <Edit2
                      size={16}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </Button>

                  <Button variant="ghost" onClick={() => openDelete(expense)}>
                    <Trash2
                      size={16}
                      className="text-red-600 dark:text-red-400"
                    />
                  </Button>

                  <Link to={`/transaction/${expense.id}`}>
                    <Button variant="ghost">
                      <Eye
                        size={16}
                        className="text-gray-600 dark:text-gray-400"
                      />
                    </Button>
                  </Link>
                </td>
              </Motion.tr>
            ))}
          </tbody>
        </table>
      </Motion.div>

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
