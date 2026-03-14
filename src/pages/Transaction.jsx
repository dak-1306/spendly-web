import { useState, useMemo, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import LineColor from "../components/common/LineColor.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import ChangeDate from "../components/common/ChangeDate.jsx";
import AddTransaction from "../components/transaction/AddTransaction.jsx";
import EditTransaction from "../components/transaction/EditTransaction.jsx";
import DeleteTransaction from "../components/transaction/DeleteTransaction.jsx";
import FilterExpense from "../components/transaction/FilterExpense.jsx";
import { Trash2, Edit2, Eye, Edit } from "lucide-react";
import { EXPENSE } from "../utils/constants.js";
import { useTransaction } from "../hooks/useTransaction";
import { formatForInputDate, formatForDisplay } from "../utils/financial.js";

import { Link } from "react-router-dom";

export default function Transaction() {
  // Icon
  const editIcon = <Edit2 className="text-blue-600" size={16} />;
  const trashIcon = <Trash2 className="text-red-600" size={16} />;
  const eyeIcon = (
    <Eye className="text-gray-600 dark:text-gray-400" size={16} />
  );

  const { transactions, loading, error } = useTransaction();
  /* ---------- Modal / UI state ---------- */
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deletingRole, setDeletingRole] = useState("expense");
  const [month, setMonth] = useState(
    (() => {
      const d = new Date();
      return d.toISOString().slice(0, 7);
    })(),
  );

  // Chuẩn hóa transactions thành incomes/expenses cho tháng hiện tại (memoized)
  const transactionNormalize = useMemo(() => {
    const monthData = {
      incomes: [],
      expenses: [],
    };
    transactions.forEach((t) => {
      if (t.type === "income" && t.month === month) {
        const date = formatForInputDate(t.date);
        monthData.incomes.push({
          ...t,
          date,
        });
      } else if (t.type === "expense" && t.month === month) {
        const date = formatForInputDate(t.date);
        monthData.expenses.push({
          ...t,
          date,
        });
      }
    });
    return monthData;
  }, [transactions, month]);

  const { incomes, expenses } = transactionNormalize;
  console.log("Normalized transactions for month", month, {
    incomes,
    expenses,
  });

  /* ---------- Helpers mở modal ---------- */
  const openEdit = useCallback((expense) => {
    setEditingExpense(expense);
    setIsEditOpen(true);
  }, []);

  const openEditIncome = useCallback((income) => {
    setEditingIncome(income);
    setIsEditIncomeOpen(true);
  }, []);

  const openDelete = useCallback((item, role = "expense") => {
    setDeletingItem(item);
    setDeletingRole(role);
    setIsDeleteOpen(true);
  }, []);

  /* ---------- Filter state & logic ---------- */
  const expenseCategories = EXPENSE.CATEGORIES;
  const amountRanges = EXPENSE.AMOUNT_RANGES;

  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateSort, setDateSort] = useState("");
  const [selectedAmountRange, setSelectedAmountRange] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const resetFilters = useCallback(() => {
    setSelectedCategory("");
    setDateSort("");
    setSelectedAmountRange("");
    setSearchTerm("");
  }, []);

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    if (selectedCategory) {
      result = result.filter((e) => e.category === selectedCategory);
    }

    if (selectedAmountRange) {
      const range = amountRanges.find((r) => r.id === selectedAmountRange);
      if (range) {
        result = result.filter(
          (e) => e.amount >= range.min && e.amount <= range.max,
        );
      }
    }

    if (dateSort) {
      result.sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return dateSort === "asc" ? da - db : db - da;
      });
    }

    if (searchTerm && searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(
        (e) =>
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.category && e.category.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [
    expenses,
    selectedCategory,
    selectedAmountRange,
    dateSort,
    searchTerm,
    amountRanges,
  ]);

  /* ---------- Render ---------- */
  if (loading) {
    return (
      <MainLayout
        auth={true}
        navbarBottom={true}
        title="Quản lý chi tiêu và thu nhập"
      >
        <div className="flex items-center justify-center h-64">
          <Card className="text-center">Đang tải dữ liệu...</Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      auth={true}
      navbarBottom={true}
      title="Quản lý chi tiêu và thu nhập"
    >
      <div className="space-y-4">
        {error && (
          <Card className="border-l-4 border-red-500 bg-red-50 text-red-700">
            Lỗi tải dữ liệu: {error.message ?? String(error)}
          </Card>
        )}

        <Card className="flex justify-between items-center mx-auto">
          <ChangeDate month={month} setMonth={setMonth} />
          <div className="flex">
            <Button
              variant="primary"
              className="mr-4"
              onClick={() => setIsAddExpenseOpen(true)}
            >
              {EXPENSE.BUTTONS.ADD_EXPENSE}
            </Button>
            <Button variant="cta" onClick={() => setIsAddIncomeOpen(true)}>
              {EXPENSE.BUTTONS.ADD_INCOME}
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Thu nhập tháng {month}
          </h2>

          <ul>
            {incomes.length === 0 && (
              <li className="text-gray-500 dark:text-gray-400">
                Chưa có thu nhập nào.
              </li>
            )}
            {incomes.map((income) => (
              <li
                key={income.id}
                className="py-2 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center"
              >
                <p className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium dark:text-gray-300">
                    {income.source ?? "Thu nhập"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {income.title ?? ""}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatForDisplay(income.date) ?? ""}
                  </span>
                </p>
                <span className="font-semibold text-green-600">
                  {income.amount?.toLocaleString() ?? 0}{" "}
                  {income.currency ?? "VND"}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => openEditIncome(income)}
                  >
                    {editIcon}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => openDelete(income, "income")}
                  >
                    {trashIcon}
                  </Button>
                  <Link to={`/transaction/${income.id}`}>
                    <Button variant="ghost">{eyeIcon}</Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <FilterExpense
            expenseCategories={expenseCategories}
            amountRanges={amountRanges}
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

          <LineColor />

          <div className="overflow-x-auto">
            <table className="w-full mt-4 table-auto">
              <thead>
                <tr className="text-left border-b border-gray-300">
                  <th className="px-4 py-2">Danh mục</th>
                  <th className="px-4 py-2">Tiêu đề</th>
                  <th className="px-4 py-2">Ngày</th>
                  <th className="px-4 py-2">Số tiền</th>
                  <th className="px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
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
                      <Button
                        variant="ghost"
                        onClick={() => openDelete(expense, "expense")}
                      >
                        {trashIcon}
                      </Button>
                      <Link to={`/transaction/${expense.id}`}>
                        <Button variant="ghost">{eyeIcon}</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {isAddExpenseOpen && (
          <AddTransaction
            open={isAddExpenseOpen}
            onClose={() => setIsAddExpenseOpen(false)}
            role="expense"
          />
        )}
        {isAddIncomeOpen && (
          <AddTransaction
            open={isAddIncomeOpen}
            onClose={() => setIsAddIncomeOpen(false)}
            role="income"
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

        {isEditIncomeOpen && editingIncome && (
          <EditTransaction
            open={isEditIncomeOpen}
            onClose={() => {
              setIsEditIncomeOpen(false);
              setEditingIncome(null);
            }}
            role="income"
            data={editingIncome}
          />
        )}

        {isDeleteOpen && deletingItem && (
          <DeleteTransaction
            open={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setDeletingItem(null);
              setDeletingRole("expense");
            }}
            role={deletingRole}
            item={deletingItem}
          />
        )}
      </div>
    </MainLayout>
  );
}
