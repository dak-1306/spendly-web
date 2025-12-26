import MainLayout from "../components/layout/MainLayout";
import sampleData from "../data/sampleData";
import CardDashboard from "../components/dashboard/CardDashboard";
import SpendingCard from "../components/dashboard/SpendingCard";
import SpendingBarChart from "../components/dashboard/SpendingBarChart";
import SpendingPieChart from "../components/dashboard/SpendingPieChart";
import Card from "../components/common/Card";
import { ICONS } from "../assets/index";

function Dashboard() {
  const month = "2025-12";
  const monthData = sampleData.find((m) => m.month === month) ?? {
    incomes: [],
    expenses: [],
  };
  const totalIncome = monthData.incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = monthData.expenses.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpense;

  // tính tháng trước
  const prevMonth = (() => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 2); // tháng trước
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  })();
  const prevData = sampleData.find((m) => m.month === prevMonth) ?? {
    incomes: [],
    expenses: [],
  };
  const prevExpense = prevData.expenses.reduce((s, e) => s + e.amount, 0);

  // phần trăm thay đổi so với tháng trước
  let percentChange = 0;
  if (prevExpense === 0) {
    percentChange = totalExpense === 0 ? 0 : 100;
  } else {
    percentChange = ((totalExpense - prevExpense) / prevExpense) * 100;
  }

  const income = ICONS.income;
  const expense = ICONS.icon_spend;
  const balanceIcon = ICONS.icon_bag_money;
  const arrowUp = ICONS.icon_arrow_up;
  const arrowDown = ICONS.icon_arrow_down;

  return (
    <MainLayout navbarBottom={true} auth={true} title="Dashboard">
      <div className="p-4 grid grid-cols-4 gap-4 w-3/4 mx-auto mb-6">
        <CardDashboard
          type="income"
          title="Thu nhập"
          amount={totalIncome}
          currency="VND"
          icon={income}
        />
        <CardDashboard
          type="expense"
          title="Chi tiêu"
          amount={totalExpense}
          currency="VND"
          icon={expense}
        />
        <CardDashboard
          type="balance"
          title="Còn lại"
          amount={balance}
          currency="VND"
          icon={balanceIcon}
        />
        <CardDashboard
          type="compare"
          title="Chi tiêu vs tháng trước"
          amount={Number(percentChange.toFixed(2))}
          currency="%"
          icon={percentChange >= 0 ? arrowUp : arrowDown}
        />
      </div>
      <div className="mt-8 px-4 grid grid-cols-3 gap-4 w-3/4 mx-auto">
        <Card className="col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-[var(--primary-blue-color)]">
            Phân bổ chi tiêu theo danh mục
          </h2>
          <SpendingPieChart
            month={month}
            expenses={monthData.expenses}
            width={440}
            height={240}
          />
        </Card>
        <Card className="col-span-1">
          <SpendingCard current={totalExpense} limit={totalIncome} />
        </Card>
      </div>
      <Card className="w-3/4 mx-auto mt-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[var(--primary-blue-color)]">
          Chi tiêu theo ngày
        </h2>
        <SpendingBarChart
          month={month}
          expenses={monthData.expenses}
          width={1000}
          height={240}
        />
      </Card>
    </MainLayout>
  );
}
export default Dashboard;
