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
import { ICONS } from "../assets/index.js";
import { useState } from "react";

export default function Expense() {
  const month = "2025-07";
  const trashIcon = ICONS.icon_trash;
  const editIcon = ICONS.icon_edit;
  const searchIcon = ICONS.icon_search;

  const monthData = sampleData.find((m) => m.month === month) ?? {
    incomes: [],
    expenses: [],
  };

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);

  // new: edit modal state (expense existing)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // new: edit modal state for income
  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  // delete modal state (shared for expense & income)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deletingRole, setDeletingRole] = useState("expense");

  // local state để lưu và hiển thị sau khi thêm
  const [expenses, setExpenses] = useState(monthData.expenses);
  const [incomes, setIncomes] = useState(monthData.incomes);

  const handleAddExpenseSubmit = (payload) => {
    const newItem = {
      id: Date.now(),
      title: payload.note || payload.category || "Chi tiêu",
      category: payload.category || "Other",
      date: payload.date,
      amount: payload.amount,
    };
    setExpenses((s) => [newItem, ...s]);
    setIsAddExpenseOpen(false);
  };

  const handleAddIncomeSubmit = (payload) => {
    const newItem = {
      id: Date.now(),
      source: payload.category || "Other",
      date: payload.date,
      amount: payload.amount,
    };
    setIncomes((s) => [newItem, ...s]);
    setIsAddIncomeOpen(false);
  };

  // new: handle edit submit (expense existing)
  const handleEditSubmit = (payload) => {
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
  };

  // new: handle edit submit for income
  const handleEditIncomeSubmit = (payload) => {
    setIncomes((s) =>
      s.map((it) =>
        it.id === payload.id
          ? {
              ...it,
              // map payload fields to income shape (source/title may vary in your data)
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
  };

  // helper to open edit modal
  const openEdit = (expense) => {
    setEditingExpense(expense);
    setIsEditOpen(true);
  };

  // helper to open edit modal for income
  const openEditIncome = (income) => {
    setEditingIncome(income);
    setIsEditIncomeOpen(true);
  };

  const openDelete = (item, role = "expense") => {
    setDeletingItem(item);
    setDeletingRole(role);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = ({ id, role }) => {
    if (role === "expense") {
      setExpenses((s) => s.filter((it) => it.id !== id));
    } else {
      setIncomes((s) => s.filter((it) => it.id !== id));
    }
  };

  // --- Filter UI / state ---
  const expenseCategories = [
    "Nhà thuê",
    "Ăn uống",
    "Siêu thị",
    "Di chuyển",
    "Giải trí",
    "Tiện ích",
    "Khác",
  ];
  const amountRanges = [
    { id: "lt100", label: "< 100,000", min: 0, max: 100000 },
    { id: "100-500", label: "100,000 - 500,000", min: 100000, max: 500000 },
    { id: "500-1M", label: "500,000 - 1,000,000", min: 500000, max: 1000000 },
    { id: "gt1M", label: "> 1,000,000", min: 1000000, max: Infinity },
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateSort, setDateSort] = useState(""); // asc | desc | ""
  const [selectedAmountRange, setSelectedAmountRange] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const resetFilters = () => {
    setSelectedCategory("");
    setDateSort("");
    setSelectedAmountRange("");
    setSearchTerm("");
  };

  // compute filtered + sorted expenses
  const getFilteredExpenses = () => {
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
  };

  const filteredExpenses = getFilteredExpenses();

  return (
    <MainLayout
      auth={true}
      navbarBottom={true}
      title="Quản lý chi tiêu và thu nhập"
    >
      <div className="space-y-4">
        <Card className="flex justify-between items-center mx-auto">
          <ChangeDate month={month} setMonth={() => {}} />
          <div className="flex">
            <Button
              variant="blue"
              className="mr-4"
              onClick={() => setIsAddExpenseOpen(true)}
            >
              Thêm chi tiêu
            </Button>
            <Button variant="green" onClick={() => setIsAddIncomeOpen(true)}>
              Thêm thu nhập
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
              <li className="py-2 border-b border-gray-300 flex justify-between items-center">
                <p className="flex items-center gap-2">
                  <span className="text-body">
                    {income && income.source ? income.source : "Lương"}
                  </span>
                  <span className="text-gray-500">
                    {income && income.title ? income.title : ""}
                  </span>
                  <span className="text-gray-500">
                    {income && income.date ? income.date : ""}
                  </span>
                </p>
                <span className="font-semibold text-[var(--primary-green-color)]">
                  {income ? income.amount.toLocaleString() : 0} VND
                </span>
                <div className="flex gap-2">
                  <Button variant="edit" onClick={() => openEditIncome(income)}>
                    <img
                      src={editIcon.src}
                      alt={editIcon.alt}
                      width={editIcon.width}
                      height={editIcon.height}
                    />
                  </Button>
                  <Button
                    variant="delete"
                    onClick={() => openDelete(income, "income")}
                  >
                    <img
                      src={trashIcon.src}
                      alt={trashIcon.alt}
                      width={trashIcon.width}
                      height={trashIcon.height}
                    />
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
            searchIcon={searchIcon}
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
                      {expense.amount.toLocaleString()} VND
                    </td>
                    <td className="px-4 py-4 flex gap-2">
                      <Button
                        variant="edit"
                        className=""
                        onClick={() => openEdit(expense)}
                      >
                        <img
                          src={editIcon.src}
                          alt={editIcon.alt}
                          width={editIcon.width}
                          height={editIcon.height}
                        />
                      </Button>
                      <Button
                        variant="delete"
                        className=""
                        onClick={() => openDelete(expense, "expense")}
                      >
                        <img
                          src={trashIcon.src}
                          alt={trashIcon.alt}
                          width={trashIcon.width}
                          height={trashIcon.height}
                        />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AddModel components */}
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

        {/* Edit modal for income */}
        <EditModel
          open={isEditIncomeOpen}
          onClose={() => {
            setIsEditIncomeOpen(false);
            setEditingIncome(null);
          }}
          role="income"
          expense={editingIncome} // EditModel prop name is `expense` — pass income object
          onSubmit={handleEditIncomeSubmit}
        />

        {/* Shared delete modal for expense & income */}
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
