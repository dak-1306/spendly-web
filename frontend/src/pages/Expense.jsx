import React, { useState, useMemo, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import LineColor from "../components/common/LineColor.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import ChangeDate from "../components/common/ChangeDate.jsx";
import AddModel from "../components/expense/AddModel.jsx";
import EditModel from "../components/expense/EditModel.jsx";
import DeleteModel from "../components/expense/Delete.jsx";
import FilterExpense from "../components/expense/FilterExpense.jsx";
import sampleData from "../data/sampleData.js";
import { EXPENSE } from "../utils/constants";

/*
  Expense.jsx
  - Trang quản lý chi tiêu & thu nhập
  - Mục tiêu: code rõ ràng, dễ bảo trì, chú thích tiếng Việt
  - Nguyên tắc: giữ state sạch, memoize dữ liệu suy ra, callbacks ổn định
*/

export default function Expense() {
  /* ---------- State: tháng đang hiển thị ---------- */
  const [month, setMonth] = useState(EXPENSE.DEFAULT_MONTH);

  /* ---------- Icon components (từ constants) ---------- */
  const { TRASH: TrashIconComp, EDIT: EditIconComp } = EXPENSE.ICONS;
  const trashIcon = useMemo(
    () => <TrashIconComp className="w-5 h-5 text-[var(--red-color)]" />,
    [TrashIconComp]
  );
  const editIcon = useMemo(
    () => <EditIconComp className="w-5 h-5 text-[var(--primary-blue-color)]" />,
    [EditIconComp]
  );

  /* ---------- Dữ liệu cơ bản cho tháng (sample / API trong thực tế) ----------
     Memoize để tránh tìm/ghi lại khi không cần thiết.
  */
  const monthData = useMemo(
    () =>
      sampleData.find((m) => m.month === month) ?? {
        incomes: [],
        expenses: [],
      },
    [month]
  );

  /* ---------- Modal / UI state ---------- */
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deletingRole, setDeletingRole] = useState("expense"); // "expense" | "income"

  /* ---------- Local lists (tạm lưu, trong app thực dùng store/API) ---------- */
  const [expenses, setExpenses] = useState(monthData.expenses);
  const [incomes, setIncomes] = useState(monthData.incomes);

  /* ---------- CRUD handlers (thêm/sửa/xóa) ----------
     - Các handler sử dụng useCallback để giữ reference ổn định khi truyền xuống modal
     - Sau submit, modal sẽ đóng và list được cập nhật local
  */
  const handleAddExpenseSubmit = useCallback((payload) => {
    const newItem = {
      id: Date.now(),
      title: payload.note || payload.category || "Chi tiêu",
      category: payload.category || "Other",
      date: payload.date,
      amount: payload.amount,
    };
    setExpenses((s) => [newItem, ...s]);
    setIsAddExpenseOpen(false);
  }, []);

  const handleAddIncomeSubmit = useCallback((payload) => {
    const newItem = {
      id: Date.now(),
      source: payload.category || "Other",
      date: payload.date,
      amount: payload.amount,
      title: payload.title || "Thu nhập",
    };
    setIncomes((s) => [newItem, ...s]);
    setIsAddIncomeOpen(false);
  }, []);

  const handleEditSubmit = useCallback((payload) => {
    setExpenses((s) =>
      s.map((it) =>
        it.id === payload.id
          ? {
              ...it,
              title: payload.note || payload.category || it.title,
              category: payload.category || it.category,
              date: payload.date,
              amount: payload.amount,
            }
          : it
      )
    );
    setIsEditOpen(false);
    setEditingExpense(null);
  }, []);

  const handleEditIncomeSubmit = useCallback((payload) => {
    setIncomes((s) =>
      s.map((it) =>
        it.id === payload.id
          ? {
              ...it,
              source: payload.category || it.source,
              title: payload.title || it.title,
              date: payload.date,
              amount: payload.amount,
            }
          : it
      )
    );
    setIsEditIncomeOpen(false);
    setEditingIncome(null);
  }, []);

  /* ---------- Helpers mở modal (giữ code rõ ràng) ---------- */
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

  /* ---------- Xác nhận xóa: cập nhật list tương ứng ---------- */
  const handleDeleteConfirm = useCallback(({ id, role }) => {
    if (role === "expense") {
      setExpenses((s) => s.filter((it) => it.id !== id));
    } else {
      setIncomes((s) => s.filter((it) => it.id !== id));
    }
    // Đóng modal do component DeleteModel sẽ gọi onClose
  }, []);

  /* ---------- Filter state & logic ----------
     - Các options lấy từ EXPENSE constants để tránh hard-code
     - Lọc, sắp xếp, tìm kiếm được memoize trong filteredExpenses
  */
  const expenseCategories = EXPENSE.CATEGORIES;
  const amountRanges = EXPENSE.AMOUNT_RANGES;

  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateSort, setDateSort] = useState(""); // "asc" | "desc" | ""
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

    // lọc theo danh mục nếu chọn
    if (selectedCategory) {
      result = result.filter((e) => e.category === selectedCategory);
    }

    // lọc theo khoảng tiền nếu chọn
    if (selectedAmountRange) {
      const range = amountRanges.find((r) => r.id === selectedAmountRange);
      if (range) {
        result = result.filter(
          (e) => e.amount >= range.min && e.amount <= range.max
        );
      }
    }

    // sắp xếp theo ngày nếu có yêu cầu
    if (dateSort) {
      result.sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return dateSort === "asc" ? da - db : db - da;
      });
    }

    // tìm kiếm theo tiêu đề/danh mục
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

  /* ---------- Render ---------- */
  return (
    <MainLayout
      auth={true}
      navbarBottom={true}
      title="Quản lý chi tiêu và thu nhập"
    >
      <div className="space-y-4">
        {/* Header: chọn tháng + nút hành động */}
        <Card className="flex justify-between items-center mx-auto">
          <ChangeDate month={month} setMonth={setMonth} />
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

        {/* Danh sách thu nhập (mục tóm tắt) */}
        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-[var(--primary-blue-color)]">
            Thu nhập tháng {month}
          </h2>

          {/* empty state khi chưa có thu nhập */}
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
                  <span className="text-body">{income.source ?? "Lương"}</span>
                  <span className="text-gray-500">{income.title ?? ""}</span>
                  <span className="text-gray-500">{income.date ?? ""}</span>
                </p>
                <span className="font-semibold text-[var(--primary-green-color)]">
                  {income.amount?.toLocaleString() ?? 0} VND
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

        {/* Bộ lọc + bảng chi tiêu */}
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
                      {expense.amount?.toLocaleString() ?? 0} VND
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

        {/* ---------- Modals: Thêm / Sửa / Xóa ---------- */}
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
          onSubmit={handleEditIncomeSubmit}
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
