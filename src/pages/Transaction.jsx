import React, { useState, useMemo, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import LineColor from "../components/common/LineColor.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import ChangeDate from "../components/common/ChangeDate.jsx";
import AddModel from "../components/transaction/AddModel.jsx";
import EditModel from "../components/transaction/EditModel.jsx";
import DeleteModel from "../components/transaction/Delete.jsx";
import FilterExpense from "../components/transaction/FilterExpense.jsx";
import { EXPENSE } from "../utils/constants.js";
import useTransaction from "../hooks/useTransaction";
import { Timestamp } from "firebase/firestore";

export default function Transaction() {
  const [month, setMonth] = useState(
    (() => {
      const d = new Date();
      return d.toISOString().slice(0, 7);
    })()
  );

  const { TRASH: TrashIconComp, EDIT: EditIconComp } = EXPENSE.ICONS;
  const trashIcon = useMemo(
    () => <TrashIconComp className="w-5 h-5 text-[var(--red-color)]" />,
    [TrashIconComp]
  );
  const editIcon = useMemo(
    () => <EditIconComp className="w-5 h-5 text-[var(--primary-blue-color)]" />,
    [EditIconComp]
  );

  const {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransaction();

  // derive incomes / expenses from context transactions by month
  const incomes = useMemo(() => {
    return (transactions || [])
      .filter((t) => t.type === "income" && t.month === month)
      .map((t) => ({
        id: t.id,
        userId: t.userId,
        type: t.type,
        source: t.source,
        category: t.category,
        title: t.title,
        amount: t.amount,
        currency: t.currency,
        date:
          t.date && typeof t.date.toDate === "function"
            ? t.date.toDate().toISOString().slice(0, 10)
            : t.date ?? "",
        month: t.month,
      }));
  }, [transactions, month]);

  const expenses = useMemo(() => {
    return (transactions || [])
      .filter((t) => t.type === "expense" && t.month === month)
      .map((t) => ({
        id: t.id,
        userId: t.userId,
        type: t.type,
        source: t.source,
        category: t.category,
        title: t.title,
        amount: t.amount,
        currency: t.currency,
        date:
          t.date && typeof t.date.toDate === "function"
            ? t.date.toDate().toISOString().slice(0, 10)
            : t.date ?? "",
        month: t.month,
      }));
  }, [transactions, month]);

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

  /* ---------- CRUD handlers using context ---------- */
  const handleAddExpenseSubmit = useCallback(
    async (formPayload) => {
      try {
        // formPayload đã có đủ các trường: userId, type, title, amount, currency, source, category, date, month
        await addTransaction(formPayload);
        setIsAddExpenseOpen(false);
      } catch (e) {
        alert("Thêm chi tiêu thất bại.");
        console.error(e);
      }
    },
    [addTransaction]
  );

  const handleAddIncomeSubmit = useCallback(
    async (formPayload) => {
      try {
        await addTransaction(formPayload);
        setIsAddIncomeOpen(false);
      } catch (e) {
        alert("Thêm thu nhập thất bại.");
        console.error(e);
      }
    },
    [addTransaction]
  );

  const handleEditSubmit = useCallback(
    async (formPayload) => {
      try {
        const id = formPayload.id;
        const jsDate = new Date(formPayload.date);
        const payload = {
          userId: formPayload.userId,
          type: formPayload.type,
          title: formPayload.title,
          amount: Number(formPayload.amount),
          currency: formPayload.currency,
          source: formPayload.source,
          category: formPayload.category,
          date: Timestamp.fromDate(jsDate),
          month: jsDate.toISOString().slice(0, 7),
        };

        await updateTransaction(id, payload);
        if (formPayload.type === "income") {
          setIsEditIncomeOpen(false);
          setEditingIncome(null);
        } else {
          setIsEditOpen(false);
          setEditingExpense(null);
        }
      } catch (e) {
        alert("Cập nhật thất bại.");
        console.error(e);
      }
    },
    [updateTransaction]
  );

  const handleDeleteConfirm = useCallback(
    async ({ id }) => {
      try {
        await deleteTransaction(id);
      } catch (e) {
        alert("Xóa thất bại.");
        console.error(e);
      }
    },
    [deleteTransaction]
  );

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
          (e) => e.amount >= range.min && e.amount <= range.max
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
          (e.category && e.category.toLowerCase().includes(q))
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

  /* ---------- handlers chuyển tháng (useCallback giống Dashboard) ---------- */
  const handlePrevMonth = useCallback(() => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 2);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }, [month]);

  const handleNextMonth = useCallback(() => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }, [month]);

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
          <ChangeDate
            month={month}
            setMonth={setMonth}
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
          />
          <div className="flex">
            <Button
              variant="blue"
              className="mr-4"
              onClick={() => setIsAddExpenseOpen(true)}
            >
              {EXPENSE.BUTTONS.ADD_EXPENSE}
            </Button>
            <Button variant="green" onClick={() => setIsAddIncomeOpen(true)}>
              {EXPENSE.BUTTONS.ADD_INCOME}
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-[var(--primary-blue-color)]">
            Thu nhập tháng {month}
          </h2>

          <ul>
            {incomes.length === 0 && (
              <li className="text-gray-500">Chưa có thu nhập nào.</li>
            )}
            {incomes.map((income) => (
              <li
                key={income.id}
                className="py-2 border-b border-gray-300 flex justify-between items-center"
              >
                <p className="flex items-center gap-2">
                  <span className="text-body">
                    {income.source ?? "Thu nhập"}
                  </span>
                  <span className="text-gray-500">{income.title ?? ""}</span>
                  <span className="text-gray-500">{income.date ?? ""}</span>
                </p>
                <span className="font-semibold text-[var(--primary-green-color)]">
                  {income.amount?.toLocaleString() ?? 0}{" "}
                  {income.currency ?? "VND"}
                </span>
                <div className="flex gap-2">
                  <Button variant="edit" onClick={() => openEditIncome(income)}>
                    {editIcon}
                  </Button>
                  <Button
                    variant="delete"
                    onClick={() => openDelete(income, "income")}
                  >
                    {trashIcon}
                  </Button>
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
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-4 py-4">{expense.category}</td>
                    <td className="px-4 py-4">{expense.title}</td>
                    <td className="px-4 py-4">{expense.date}</td>
                    <td className="px-4 py-4 font-semibold text-[var(--red-color)]">
                      {expense.amount?.toLocaleString() ?? 0}{" "}
                      {expense.currency ?? "VND"}
                    </td>
                    <td className="px-4 py-4 flex gap-2">
                      <Button variant="edit" onClick={() => openEdit(expense)}>
                        {editIcon}
                      </Button>
                      <Button
                        variant="delete"
                        onClick={() => openDelete(expense, "expense")}
                      >
                        {trashIcon}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <AddModel
          open={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          role="expense"
          onSubmit={handleAddExpenseSubmit}
        />
        <AddModel
          open={isAddIncomeOpen}
          onClose={() => setIsAddIncomeOpen(false)}
          role="income"
          onSubmit={handleAddIncomeSubmit}
        />

        <EditModel
          open={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingExpense(null);
          }}
          role="expense"
          expense={editingExpense}
          onSubmit={handleEditSubmit}
        />

        <EditModel
          open={isEditIncomeOpen}
          onClose={() => {
            setIsEditIncomeOpen(false);
            setEditingIncome(null);
          }}
          role="income"
          expense={editingIncome}
          onSubmit={handleEditSubmit}
        />

        <DeleteModel
          open={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeletingItem(null);
          }}
          role={deletingRole}
          item={deletingItem}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </MainLayout>
  );
}
