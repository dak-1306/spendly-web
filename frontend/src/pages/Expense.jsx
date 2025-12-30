import MainLayout from "../components/layout/MainLayout.jsx";
import LineColor from "../components/common/LineColor.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import ChangeDate from "../components/common/ChangeDate.jsx";
import sampleData from "../data/sampleData.js";
import { ICONS } from "../assets/index.js";

function Expense() {
  const month = "2025-07";
  const trashIcon = ICONS.icon_trash;
  const editIcon = ICONS.icon_edit;
  const searchIcon = ICONS.icon_search;

  const monthData = sampleData.find((m) => m.month === month) ?? {
    incomes: [],
    expenses: [],
  };
  const salaryIncome = monthData.incomes.find((i) => i.source === "Lương");
  const freelanceIncome = monthData.incomes.find(
    (i) => i.source === "Freelance"
  );
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
            <Button variant="blue" className="mr-4">
              Thêm chi tiêu
            </Button>
            <Button variant="green">Thêm thu nhập</Button>
          </div>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-[var(--primary-blue-color)]">
            Thu nhập tháng {month}
          </h2>
          <ul>
            <li className="py-2 border-b border-gray-300 flex justify-between">
              <p className="flex items-center gap-2">
                <span className="text-body">Lương</span>
                <span className="text-gray-500">
                  {salaryIncome.date ? salaryIncome.date : ""}
                </span>
              </p>
              <span className="font-semibold text-green-600">
                {salaryIncome ? salaryIncome.amount.toLocaleString() : 0} VND
              </span>
            </li>
            <li className="py-2 border-b border-gray-300 flex justify-between">
              <p className="flex items-center gap-2">
                <span className="text-body">Freelance</span>
                <span className="text-gray-500">
                  {freelanceIncome.date ? freelanceIncome.date : ""}
                </span>
              </p>
              <span className="font-semibold text-green-600">
                {freelanceIncome ? freelanceIncome.amount.toLocaleString() : 0}{" "}
                VND
              </span>
            </li>
          </ul>
        </Card>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button variant="primary">Tất cả</Button>
              <Button variant="secondary">Theo loại</Button>
              <Button variant="secondary">Theo ngày</Button>
              <Button variant="secondary">Theo số tiền</Button>
            </div>
            <form className="flex items-center" action="">
              <input
                type="text"
                placeholder="Tìm kiếm chi tiêu..."
                className="border border-gray-300 rounded-md px-4 py-2 ml-auto"
              />
              <Button variant="primary" className="ml-2">
                <img
                  src={searchIcon.src}
                  alt={searchIcon.alt}
                  width={searchIcon.width}
                  height={searchIcon.height}
                />
              </Button>
            </form>
          </div>
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
                {monthData.expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-4 py-4">{expense.category}</td>
                    <td className="px-4 py-4">{expense.title}</td>
                    <td className="px-4 py-4">{expense.date}</td>
                    <td className="px-4 py-4 font-semibold text-red-600">
                      {expense.amount.toLocaleString()} VND
                    </td>
                    <td className="px-4 py-4 flex gap-2">
                      <Button variant="edit" className="">
                        <img
                          src={editIcon.src}
                          alt={editIcon.alt}
                          width={editIcon.width}
                          height={editIcon.height}
                        />
                      </Button>
                      <Button variant="delete" className="">
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
      </div>
    </MainLayout>
  );
}
export default Expense;
