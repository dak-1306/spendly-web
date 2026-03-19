import { useState, useMemo, useCallback, useEffect } from "react";

import MainLayout from "../components/layout/MainLayout.jsx";
import LineColor from "../components/common/LineColor.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import ChangeDate from "../components/common/ChangeDate.jsx";
import Pagination from "../components/common/Pagination.jsx";

import AddTransaction from "../components/transaction/AddTransaction.jsx";
import EditTransaction from "../components/transaction/EditTransaction.jsx";
import DeleteTransaction from "../components/transaction/DeleteTransaction.jsx";
import FilterExpense from "../components/transaction/FilterExpense.jsx";
import { Trash2, Edit2, Eye } from "lucide-react";
import { EXPENSE } from "../utils/constants.js";
import { useTransaction } from "../hooks/useTransaction";
import { useAuth } from "../hooks/useAuth";

import { formatForInputDate, formatForDisplay } from "../utils/financial.js";

import { Link } from "react-router-dom";

export default function Transaction() {
  // Icon
  const editIcon = (
    <Edit2 className="text-blue-600 dark:text-blue-400" size={16} />
  );
  const trashIcon = (
    <Trash2 className="text-red-600 dark:text-red-400" size={16} />
  );
  const eyeIcon = (
    <Eye className="text-gray-600 dark:text-gray-400" size={16} />
  );

  const {
    incomes,
    expenses,
    month,
    setMonth,
    GetExpense,
    GetIncome,
    loading,
    error,
  } = useTransaction();
  const { user } = useAuth();
  const userId = user?.uid;

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

  /* ---------- Filter state & logic ---------- */
  const expenseCategories = EXPENSE.CATEGORIES;
  const amountRanges = EXPENSE.AMOUNT_RANGES;

  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateSort, setDateSort] = useState("");
  const [selectedAmountRange, setSelectedAmountRange] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [cursorIncome, setCursorIncome] = useState(null);
  const [cursorStackIncome, setCursorStackIncome] = useState([]);
  const [cursorExpense, setCursorExpense] = useState(null);
  const [cursorStackExpense, setCursorStackExpense] = useState([]);

  const itemsPerPage = 5;
  useEffect(() => {
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

      setCursorExpense(nextCursor);
      setCursorStackExpense([]);
    };

    load();
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
      const expenseFormatDate = expenses.results.map((expense) => ({
        ...expense,
        date: formatForInputDate(expense.date),
      }));
      return expenseFormatDate;
    }
    return [];
  }, [expenses]);

  useEffect(() => {
    const load = async () => {
      const { nextCursor } = await GetIncome(
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
      setCursorIncome(nextCursor);
      setCursorStackIncome([]);
    };
    load();
  }, [
    userId,
    month,
    selectedCategory,
    selectedAmountRange,
    dateSort,
    searchTerm,
    GetIncome,
  ]);
  const resultIncomes = useMemo(() => {
    if (incomes?.results) {
      const incomeFormatDate = incomes.results.map((income) => ({
        ...income,
        date: formatForInputDate(income.date),
      }));
      return incomeFormatDate;
    }
    return [];
  }, [incomes]);

  const onNext = async (role) => {
    if (role === "income") {
      const res = await GetIncome(
        userId,

        { limit: itemsPerPage, cursor: cursorIncome },
      );
      if (res?.nextCursor) {
        setCursorStackIncome((prev) => [...prev, cursorIncome]);
        setCursorIncome(res.nextCursor);
      }
    } else {
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
    }
  };

  const onPrev = async (role) => {
    if (role === "income") {
      if (cursorStackIncome.length === 0) {
        const res = await GetIncome(
          userId,

          { limit: itemsPerPage, cursor: null },
        );
        setCursorStackIncome([]);
        setCursorIncome(res?.nextCursor ?? null);
        return;
      }
      const newStack = cursorStackIncome.slice(0, -1);
      const newTop = newStack.length ? newStack[newStack.length - 1] : null;
      setCursorStackIncome(newStack);
      const res = await GetIncome(
        userId,

        { limit: itemsPerPage, cursor: newTop },
      );
      setCursorIncome(res?.nextCursor ?? null);
      return;
    }
    const filters = {
      category: selectedCategory || null,
      amountRange: selectedAmountRange || null,
      sortBy: dateSort || null,
      searchTerm: searchTerm || null,
    };
    // nếu không có history, load trang đầu (cursor = null)
    if (cursorStackExpense.length === 0) {
      const res = await GetExpense(userId, filters, {
        limit: itemsPerPage,
        cursor: null,
      });
      setCursorStackExpense([]);
      setCursorExpense(res?.nextCursor ?? null);
      return;
    }

    // tính newStack và newTop trước khi setState
    const newStack = cursorStackExpense.slice(0, -1);
    const newTop = newStack.length ? newStack[newStack.length - 1] : null;
    setCursorStackExpense(newStack);

    const res = await GetExpense(userId, filters, {
      limit: itemsPerPage,
      cursor: newTop,
    });
    setCursorExpense(res?.nextCursor ?? null);
  };
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

  const resetFilters = useCallback(() => {
    setSelectedCategory("");
    setDateSort("");
    setSelectedAmountRange("");
    setSearchTerm("");
  }, []);

  console.log("expenses:", resultExpenses);
  console.log("incomes:", resultIncomes);
  console.log("cursor: ", cursorExpense);
  console.log("cursor stack: ", cursorStackExpense);

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
            {loading && resultIncomes.length === 0 && (
              <li className="text-gray-500 dark:text-gray-400">
                Chưa có thu nhập nào.
              </li>
            )}
            {!loading &&
              resultIncomes.map((income) => (
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
          <Pagination
            onPrev={() => onPrev("income")}
            onNext={() => onNext("income")}
            hasNext={resultIncomes.length === itemsPerPage}
          />
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
                {!loading &&
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
                        <Button
                          variant="ghost"
                          onClick={() => openEdit(expense)}
                        >
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
          <Pagination
            onPrev={() => onPrev("expense")}
            onNext={() => onNext("expense")}
            hasNext={resultExpenses.length === itemsPerPage}
          />
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
