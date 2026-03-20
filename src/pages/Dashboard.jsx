import { useMemo, useCallback, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import CardDashboard from "../components/dashboard/CardDashboard";
import SpendingCard from "../components/dashboard/SpendingCard";
import SpendingBarChart from "../components/dashboard/SpendingBarChart";
import SpendingPieChart from "../components/dashboard/SpendingPieChart";
import Card from "../components/common/Card";
import ChangeDate from "../components/common/ChangeDate";
import { useTransaction } from "../hooks/useTransaction";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";

import SkeletonDashboard from "../components/dashboard/SkeletonDashboard";

import { motion } from "framer-motion";

import {
  transactionToMonth,
  balance,
  prevMonth,
  totalIncome,
  totalExpense,
  prevExpense,
  formatPercent,
} from "../utils/financial";

/* Static chart config (khai báo ngoài component để tránh recreate mỗi render) */

export default function Dashboard() {
  const { t } = useLanguage();
  // transactions từ context (dữ liệu thật)
  const {
    loading,
    month,
    setMonth,
    error,
    transactionCurrent,
    transactionPrev,
    fetchTransactionCurrent,
    fetchTransactionPrev,
  } = useTransaction();
  const { user } = useAuth();
  const userId = user?.uid;

  // Lấy dữ liệu cho tháng hiện tại
  useEffect(() => {
    fetchTransactionCurrent(userId);
  }, [fetchTransactionCurrent, userId]);

  // Lấy dữ liệu cho tháng trước
  useEffect(() => {
    fetchTransactionPrev(userId, month);
  }, [fetchTransactionPrev, userId, month]);

  // lấy dữ liệu cho tháng đang chọn từ transactions
  const currentData = useMemo(() => {
    return {
      incomes: transactionCurrent.filter(
        (t) => transactionToMonth(t) === month && t.type === "income",
      ),
      expenses: transactionCurrent.filter(
        (t) => transactionToMonth(t) === month && t.type === "expense",
      ),
    };
  }, [transactionCurrent, month]);

  const prevData = useMemo(() => {
    return {
      incomes: transactionPrev.filter(
        (t) =>
          transactionToMonth(t) === prevMonth({ month }) && t.type === "income",
      ),
      expenses: transactionPrev.filter(
        (t) =>
          transactionToMonth(t) === prevMonth({ month }) &&
          t.type === "expense",
      ),
    };
  }, [transactionPrev, month]);

  // normalize dữ liệu ngày tháng cho charts (vì có thể là Timestamp hoặc Date, memoized để tránh recreate khi không cần) - trả về array mới với date đã chuẩn hóa
  const normalizeDate = useCallback((item) => {
    if (!item) return item;
    const d =
      item.date && typeof item.date.toDate === "function"
        ? item.date.toDate()
        : item.date instanceof Date
          ? item.date
          : new Date(item.date);
    return { ...item, date: d };
  }, []);

  const normalizedMonthExpenses = useMemo(
    () => currentData.expenses.map(normalizeDate),
    [currentData.expenses, normalizeDate],
  );

  const percentChange = useMemo(() => {
    const current = totalExpense({ data: currentData.expenses });
    const prev = prevExpense({ prevDataExpenses: prevData.expenses });
    if (prev === 0) return current === 0 ? 0 : 100;
    return ((current - prev) / prev) * 100;
  }, [currentData, prevData]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <MainLayout
        navbarBottom={true}
        auth={true}
        title={t("dashboard.pageTitle") || "Bảng điều khiển"}
      >
        <SkeletonDashboard />
      </MainLayout>
    );
  } else if (error) {
    return (
      <MainLayout
        navbarBottom={true}
        auth={true}
        title={t("dashboard.pageTitle") || "Bảng điều khiển"}
      >
        <div className="flex items-center justify-center h-64">
          <Card className="text-center text-red-500">
            {t("dashboard.error", "Lỗi: ") + error}
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      navbarBottom={true}
      auth={true}
      title={t("dashboard.pageTitle") || "Bảng điều khiển"}
    >
      {/* Header: chọn tháng */}
      <Card className="mb-4 flex items-center gap-3 mx-auto">
        <ChangeDate month={month} setMonth={setMonth} />
        {/* aria-live để thông báo thay đổi tháng cho assistive tech */}
        <div
          className="ml-auto font-semibold text-lg text-blue-500 dark:text-blue-400"
          aria-live="polite"
        >
          {month}
        </div>
      </Card>

      {/* Cards tóm tắt (income/expense/balance/compare) */}
      {!loading && currentData.expenses.length === 0 && currentData.incomes.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Card className="text-center">Không có dữ liệu</Card>
        </div>
      ) : (
        <>
          <motion.div
            key={month}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-4 gap-4 mx-auto mb-6"
          >
            <motion.div variants={item}>
              <CardDashboard
                type="income"
                title={t("dashboard.cardTitles.income")}
                amount={totalIncome({ data: currentData.incomes })}
                currency="VND"
              />
            </motion.div>
            <motion.div variants={item}>
              <CardDashboard
                type="expense"
                title={t("dashboard.cardTitles.expenses")}
                amount={totalExpense({ data: currentData.expenses })}
                currency="VND"
              />
            </motion.div>
            <motion.div variants={item}>
              <CardDashboard
                type="balance"
                title={t("dashboard.cardTitles.balance")}
                amount={balance({
                  dataIncome: currentData.incomes,
                  dataExpense: currentData.expenses,
                })}
                currency="VND"
              />
            </motion.div>
            <motion.div variants={item}>
              <CardDashboard
                type="compare"
                title={t("dashboard.cardTitles.compare")}
                amount={formatPercent(percentChange)}
                currency="%"
              />
            </motion.div>
          </motion.div>

          {/* Charts: pie + info card */}
          <motion.div
            key={month + "-charts"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 grid grid-cols-3 gap-4 mx-auto"
          >
            <Card className="col-span-2">
              <SpendingPieChart
                month={month}
                title={t("dashboard.chartTitles.expensesByCategory")}
                expenses={normalizedMonthExpenses}
              />
            </Card>

            <Card className="col-span-1">
              <SpendingCard
                title={t("dashboard.chartTitles.spendingCardTitle")}
                current={totalExpense({ data: currentData.expenses })}
                limit={totalIncome({ data: currentData.incomes })}
              />
            </Card>
          </motion.div>

          {/* Bar chart hiển thị theo thời gian */}
          <motion.div
            key={month + "-bar"}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="mx-auto mt-6 mb-8">
              <SpendingBarChart
                month={month}
                title={t("dashboard.chartTitles.expensesOverTime")}
                expenses={normalizedMonthExpenses}
              />
            </Card>
          </motion.div>
        </>
      )}
    </MainLayout>
  );
}
