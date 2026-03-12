import { useState, useMemo, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
// import sampleData from "../data/sampleData";
import CardDashboard from "../components/dashboard/CardDashboard";
import SpendingCard from "../components/dashboard/SpendingCard";
import SpendingBarChart from "../components/dashboard/SpendingBarChart";
import SpendingPieChart from "../components/dashboard/SpendingPieChart";
import Card from "../components/common/Card";
import ChangeDate from "../components/common/ChangeDate";
import { DASHBOARD } from "../utils/constants";
import { useTransaction } from "../hooks/useTransaction";

import {
  DollarSign,
  CreditCard,
  Wallet,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

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
  const { transactions } = useTransaction();
  // state chọn tháng hiển thị
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
  });

  // Icon
  const incomeIcon = <DollarSign className="text-white" size={24} />;
  const expenseIcon = <CreditCard className="text-white" size={24} />;
  const balanceIcon = <Wallet className="text-white" size={24} />;
  const arrowUp = <ArrowUp className="text-white" size={24} />;
  const arrowDown = <ArrowDown className="text-white" size={24} />;

  // lấy dữ liệu cho tháng đang chọn từ transactions
  const monthData = useMemo(() => {
    const filtered = transactions.filter(
      (t) => transactionToMonth(t) === month,
    );
    return {
      incomes: filtered.filter((t) => t.type === "income"),
      expenses: filtered.filter((t) => t.type === "expense"),
    };
  }, [transactions, month]);

  const prevData = useMemo(() => {
    const prevMonthStr = prevMonth({ month });
    const filtered = transactions.filter(
      (t) => transactionToMonth(t) === prevMonthStr,
    );
    return {
      incomes: filtered.filter((t) => t.type === "income"),
      expenses: filtered.filter((t) => t.type === "expense"),
    };
  }, [transactions, month]);

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
    () => monthData.expenses.map(normalizeDate),
    [monthData.expenses, normalizeDate],
  );

  const _normalizedMonthIncomes = useMemo(
    () => monthData.incomes.map(normalizeDate),
    [monthData.incomes, normalizeDate],
  );

  // phần trăm thay đổi chi tiêu so với tháng trước

  const percentChange = useMemo(() => {
    const current = totalExpense({ monthData });
    const prev = prevExpense({ prevDataExpenses: prevData.expenses });
    if (prev === 0) return current === 0 ? 0 : 100;
    return ((current - prev) / prev) * 100;
  }, [monthData, prevData]);

  return (
    <MainLayout navbarBottom={true} auth={true} title={DASHBOARD.PAGE_TITLE.vi}>
      {/* Header: chọn tháng */}
      <Card className="mb-4 flex items-center gap-3 mx-auto">
        <ChangeDate month={month} setMonth={setMonth} />
        {/* aria-live để thông báo thay đổi tháng cho assistive tech */}
        <div
          className="ml-auto font-semibold text-lg text-blue-500"
          aria-live="polite"
        >
          {month}
        </div>
      </Card>

      {/* Cards tóm tắt (income/expense/balance/compare) */}
      <div className="grid grid-cols-4 gap-4 mx-auto mb-6">
        <CardDashboard
          type="income"
          title={DASHBOARD.CARD_TITLES.INCOME}
          amount={totalIncome({ monthData })}
          currency="VND"
          icon={incomeIcon}
        />
        <CardDashboard
          type="expense"
          title={DASHBOARD.CARD_TITLES.EXPENSES}
          amount={totalExpense({ monthData })}
          currency="VND"
          icon={expenseIcon}
        />
        <CardDashboard
          type="balance"
          title={DASHBOARD.CARD_TITLES.BALANCE}
          amount={balance({ monthData })}
          currency="VND"
          icon={balanceIcon}
        />
        <CardDashboard
          type="compare"
          title={DASHBOARD.CARD_TITLES.COMPARE}
          amount={formatPercent(percentChange)}
          currency="%"
          icon={percentChange >= 0 ? arrowUp : arrowDown}
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
            current={totalExpense({ monthData })}
            limit={totalIncome({ monthData })}
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
    </MainLayout>
  );
}
