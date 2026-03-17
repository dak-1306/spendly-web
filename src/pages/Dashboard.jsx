import { useState, useMemo, useCallback, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import CardDashboard from "../components/dashboard/CardDashboard";
import SpendingCard from "../components/dashboard/SpendingCard";
import SpendingBarChart from "../components/dashboard/SpendingBarChart";
import SpendingPieChart from "../components/dashboard/SpendingPieChart";
import Card from "../components/common/Card";
import ChangeDate from "../components/common/ChangeDate";
import { DASHBOARD } from "../utils/constants";
import { useTransaction } from "../hooks/useTransaction";
import { useAuth } from "../hooks/useAuth";

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
  // transactions từ context (dữ liệu thật)
  const { loading, error, transactionCurrent, transactionPrev, fetchTransactionCurrent, fetchTransactionPrev } = useTransaction();
  const { user } = useAuth();
  const userId = user?.uid;
  // state chọn tháng hiển thị
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
  });

  // Lấy dữ liệu cho tháng hiện tại
  useEffect(() => {
    fetchTransactionCurrent(userId, month);
  }, [fetchTransactionCurrent, userId, month]);

  // Lấy dữ liệu cho tháng trước
  useEffect(() => {
    fetchTransactionPrev(userId, month);
  }, [fetchTransactionPrev, userId, month]);

  // lấy dữ liệu cho tháng đang chọn từ transactions
  const currentData = useMemo(() => {

    return {
      incomes: transactionCurrent.filter((t) => transactionToMonth(t) === month && t.type === "income"),
      expenses: transactionCurrent.filter((t) => transactionToMonth(t) === month && t.type === "expense"),
    };
  }, [transactionCurrent, month]);

  const prevData = useMemo(() => {
      return {
      incomes: transactionPrev.filter((t) => transactionToMonth(t) === prevMonth({ month }) && t.type === "income"),
      expenses: transactionPrev.filter((t) => transactionToMonth(t) === prevMonth({ month }) && t.type === "expense"),
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

  // const normalizedMonthIncomes = useMemo(
  //   () => currentData.incomes.map(normalizeDate),
  //   [currentData.incomes, normalizeDate],
  // );

  // phần trăm thay đổi chi tiêu so với tháng trước

  const percentChange = useMemo(() => {
    const current = totalExpense({ data: currentData.expenses });
    const prev = prevExpense({ prevDataExpenses: prevData.expenses });
    if (prev === 0) return current === 0 ? 0 : 100;
    return ((current - prev) / prev) * 100;
  }, [currentData, prevData]);

  console.log('current data:', currentData)
  console.log('prev data:', prevData)

  if(loading) {
    return (
      <MainLayout navbarBottom={true} auth={true} title={DASHBOARD.PAGE_TITLE.vi}>
        <div className="flex items-center justify-center h-64">
          <Card className="text-center">Đang tải dữ liệu...</Card>
        </div>
      </MainLayout>
    )
  } else{
    if(error) {
      return (
        <MainLayout navbarBottom={true} auth={true} title={DASHBOARD.PAGE_TITLE.vi}>
          <div className="flex items-center justify-center h-64">
            <Card className="text-center">Lỗi tải dữ liệu: {error.message}</Card>
          </div>
        </MainLayout>
      )
    }

    
  }

  return (
      <MainLayout navbarBottom={true} auth={true} title={DASHBOARD.PAGE_TITLE.vi}>
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
      {currentData.expenses.length === 0 && currentData.incomes.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Card className="text-center">Không có dữ liệu</Card>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mx-auto mb-6">
            <CardDashboard
              type="income"
              title={DASHBOARD.CARD_TITLES.INCOME}
              amount={totalIncome({ data: currentData.incomes })}
              currency="VND"
            />
            <CardDashboard
              type="expense"
              title={DASHBOARD.CARD_TITLES.EXPENSES}
              amount={totalExpense({ data: currentData.expenses })}
              currency="VND"
            />
            <CardDashboard
              type="balance"
              title={DASHBOARD.CARD_TITLES.BALANCE}
              amount={balance({ dataIncome: currentData.incomes, dataExpense: currentData.expenses })}
              currency="VND"
            />
            <CardDashboard
              type="compare"
              title={DASHBOARD.CARD_TITLES.COMPARE}
              amount={formatPercent(percentChange)}
              currency="%"
            />
          </div>

          {/* Charts: pie + info card */}
          <div className="mt-8 grid grid-cols-3 gap-4 mx-auto">
            <Card className="col-span-2">
              <SpendingPieChart
                month={month}
                title={DASHBOARD.CHART_TITLES.EXPENSES_BY_CATEGORY}
                expenses={normalizedMonthExpenses}
              />
            </Card>

            <Card className="col-span-1">
              <SpendingCard
                current={totalExpense({ data: currentData.expenses })}
                limit={totalIncome({ data: currentData.incomes })}
              />
            </Card>
          </div>

          {/* Bar chart hiển thị theo thời gian */}
          <Card className="mx-auto mt-6 mb-8">
            <SpendingBarChart
              month={month}
              title={DASHBOARD.CHART_TITLES.EXPENSES_OVER_TIME}
              expenses={normalizedMonthExpenses}
            />
          </Card>
        </>
      )}
    </MainLayout>
    
   
  );
}
