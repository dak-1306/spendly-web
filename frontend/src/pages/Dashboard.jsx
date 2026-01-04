import React, { useState, useMemo, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import sampleData from "../data/sampleData";
import CardDashboard from "../components/dashboard/CardDashboard";
import SpendingCard from "../components/dashboard/SpendingCard";
import SpendingBarChart from "../components/dashboard/SpendingBarChart";
import SpendingPieChart from "../components/dashboard/SpendingPieChart";
import Card from "../components/common/Card";
import ChangeDate from "../components/common/ChangeDate";
import { DASHBOARD } from "../utils/constants";

/* Static chart config (khai báo ngoài component để tránh recreate mỗi render) */
const PIE_CHART_CONFIG = { WIDTH: 440, HEIGHT: 240 };
const BAR_CHART_CONFIG = { WIDTH: 1000, HEIGHT: 240 };

/* Formatter nhỏ cho phần trăm */
const formatPercent = (v) => Number(v.toFixed(2));

export default function Dashboard() {
  // state chọn tháng hiển thị
  const [month, setMonth] = useState(DASHBOARD.DEFAULT_MONTH);

  // lấy component icon từ constants (component refs, không phải JSX)
  const {
    DOLLAR: DollarIconComp,
    CREDIT_CARD: CreditCardComp,
    WALLET: WalletComp,
    ARROW_UP: ArrowUpComp,
    ARROW_DOWN: ArrowDownComp,
  } = DASHBOARD.ICONS;

  // memoize icons dưới dạng JSX để tránh recreate khi không cần
  const incomeIcon = useMemo(
    () => <DollarIconComp className="w-6 h-6 text-white" />,
    [DollarIconComp]
  );
  const expenseIcon = useMemo(
    () => <CreditCardComp className="w-6 h-6 text-white" />,
    [CreditCardComp]
  );
  const balanceIcon = useMemo(
    () => <WalletComp className="w-6 h-6 text-white" />,
    [WalletComp]
  );
  const arrowUp = useMemo(
    () => <ArrowUpComp className="w-6 h-6 text-white" />,
    [ArrowUpComp]
  );
  const arrowDown = useMemo(
    () => <ArrowDownComp className="w-6 h-6 text-white" />,
    [ArrowDownComp]
  );

  // lấy dữ liệu cho tháng đang chọn (memo để tránh tính lại không cần thiết)
  const monthData = useMemo(
    () =>
      sampleData.find((m) => m.month === month) ?? {
        incomes: [],
        expenses: [],
      },
    [month]
  );

  // tổng thu nhập và chi tiêu cho tháng (memoized)
  const totalIncome = useMemo(
    () => monthData.incomes.reduce((s, i) => s + (i.amount || 0), 0),
    [monthData.incomes]
  );
  const totalExpense = useMemo(
    () => monthData.expenses.reduce((s, e) => s + (e.amount || 0), 0),
    [monthData.expenses]
  );

  // số dư hiện tại
  const balance = useMemo(
    () => totalIncome - totalExpense,
    [totalIncome, totalExpense]
  );

  // tính tháng trước để so sánh (memoized)
  const prevMonth = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 2);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, [month]);

  const prevData = useMemo(
    () =>
      sampleData.find((m) => m.month === prevMonth) ?? {
        incomes: [],
        expenses: [],
      },
    [prevMonth]
  );
  const prevExpense = useMemo(
    () => prevData.expenses.reduce((s, e) => s + (e.amount || 0), 0),
    [prevData.expenses]
  );

  // phần trăm thay đổi chi tiêu so với tháng trước
  const percentChange = useMemo(() => {
    if (prevExpense === 0) return totalExpense === 0 ? 0 : 100;
    return ((totalExpense - prevExpense) / prevExpense) * 100;
  }, [totalExpense, prevExpense]);

  // handlers chuyển tháng (useCallback để stable reference khi truyền xuống con)
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

  return (
    <MainLayout navbarBottom={true} auth={true} title={DASHBOARD.PAGE_TITLE.vi}>
      {/* Header: chọn tháng */}
      <Card className="mb-4 flex items-center gap-3 mx-auto">
        <ChangeDate
          month={month}
          setMonth={setMonth}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
        />
        {/* aria-live để thông báo thay đổi tháng cho assistive tech */}
        <div
          className="ml-auto font-semibold text-lg text-h1"
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
          amount={totalIncome}
          currency="VND"
          icon={incomeIcon}
        />
        <CardDashboard
          type="expense"
          title={DASHBOARD.CARD_TITLES.EXPENSES}
          amount={totalExpense}
          currency="VND"
          icon={expenseIcon}
        />
        <CardDashboard
          type="balance"
          title={DASHBOARD.CARD_TITLES.BALANCE}
          amount={balance}
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
            expenses={monthData.expenses}
            width={PIE_CHART_CONFIG.WIDTH}
            height={PIE_CHART_CONFIG.HEIGHT}
          />
        </Card>

        <Card className="col-span-1">
          <SpendingCard current={totalExpense} limit={totalIncome} />
        </Card>
      </div>

      {/* Bar chart hiển thị theo thời gian */}
      <Card className="mx-auto mt-6 mb-8">
        <SpendingBarChart
          month={month}
          title={DASHBOARD.CHART_TITLES.EXPENSES_OVER_TIME}
          expenses={monthData.expenses}
          width={BAR_CHART_CONFIG.WIDTH}
          height={BAR_CHART_CONFIG.HEIGHT}
        />
      </Card>
    </MainLayout>
  );
}
