import { useState, useEffect, useMemo, useCallback } from "react";
import { useTransaction } from "../../hooks/useTransaction.js";
import { useAuth } from "../../hooks/useAuth.js";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import AddTransaction from "../../components/transaction/AddTransaction.jsx";
import { useLanguage } from "../../hooks/useLanguage";
import EditTransaction from "../../components/transaction/EditTransaction.jsx";
import DeleteTransaction from "../../components/transaction/DeleteTransaction.jsx";
import { Edit2, Trash2, Eye } from "lucide-react";
import { formatForInputDate, formatForDisplay } from "../../utils/financial.js";
import { Link } from "react-router-dom";

export default function IncomePage() {
  const { incomes, month, GetIncome, loading, error } = useTransaction();
  const { user } = useAuth();
  const userId = user?.uid;
  const { t } = useLanguage();

  const [cursorIncome, setCursorIncome] = useState(null);
  const [cursorStackIncome, setCursorStackIncome] = useState([]);
  const itemsPerPage = 5;

  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { nextCursor } = await GetIncome(userId, {
        limit: itemsPerPage,
        cursor: null,
      });
      if (!mounted) return;
      setCursorIncome(nextCursor);
      setCursorStackIncome([]);
    };
    load();
    return () => (mounted = false);
  }, [userId, month, GetIncome]);

  const resultIncomes = useMemo(() => {
    if (incomes?.results) {
      return incomes.results.map((income) => ({
        ...income,
        date: formatForInputDate(income.date),
      }));
    }
    return [];
  }, [incomes]);

  const onNext = async () => {
    const res = await GetIncome(userId, {
      limit: itemsPerPage,
      cursor: cursorIncome,
    });
    if (res?.nextCursor) {
      setCursorStackIncome((prev) => [...prev, cursorIncome]);
      setCursorIncome(res.nextCursor);
    }
  };

  const onPrev = async () => {
    if (cursorStackIncome.length === 0) {
      const res = await GetIncome(userId, {
        limit: itemsPerPage,
        cursor: null,
      });
      setCursorStackIncome([]);
      setCursorIncome(res?.nextCursor ?? null);
      return;
    }
    const newStack = cursorStackIncome.slice(0, -1);
    const newTop = newStack.length ? newStack[newStack.length - 1] : null;
    setCursorStackIncome(newStack);
    const res = await GetIncome(userId, {
      limit: itemsPerPage,
      cursor: newTop,
    });
    setCursorIncome(res?.nextCursor ?? null);
  };

  const openEditIncome = useCallback((income) => {
    setEditingIncome(income);
    setIsEditIncomeOpen(true);
  }, []);

  const openDelete = useCallback((item) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
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
    <Card className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
          {t("transactions.pageTitle", `Thu nhập tháng ${month}`)}
        </h2>
        <Button
          size="md"
          variant="cta"
          onClick={() => setIsAddIncomeOpen(true)}
        >
          {t("transactions.buttons.addIncome", "Thêm thu nhập")}
        </Button>
      </div>
      <ul>
        {loading && resultIncomes.length === 0 && (
          <li className="text-gray-500 dark:text-gray-400">
            {t("transactions.loading", "Đang tải dữ liệu...")}
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
                <Button variant="ghost" onClick={() => openEditIncome(income)}>
                  {editIcon}
                </Button>
                <Button variant="ghost" onClick={() => openDelete(income)}>
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
        onPrev={onPrev}
        onNext={onNext}
        hasNext={resultIncomes.length === itemsPerPage}
      />

      {isAddIncomeOpen && (
        <AddTransaction
          open={isAddIncomeOpen}
          onClose={() => setIsAddIncomeOpen(false)}
          role="income"
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
          }}
          role="income"
          item={deletingItem}
        />
      )}
    </Card>
  );
}
