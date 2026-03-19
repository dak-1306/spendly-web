import MainLayout from "../../components/layout/MainLayout.jsx";
import ChangeDate from "../../components/common/ChangeDate.jsx";
import IncomePage from "./IncomePage.jsx";
import ExpensePage from "./ExpensePage.jsx";

import { useTransaction } from "../../hooks/useTransaction.js";

export default function Transaction() {
  const { month, setMonth } = useTransaction();

  return (
    <MainLayout
      auth={true}
      navbarBottom={true}
      title="Quản lý chi tiêu và thu nhập"
    >
      <div className="space-y-4 mt-4">
        <div className="mx-auto">
          <ChangeDate month={month} setMonth={setMonth} />
        </div>
        <IncomePage />
        <ExpensePage />
      </div>
    </MainLayout>
  );
}
