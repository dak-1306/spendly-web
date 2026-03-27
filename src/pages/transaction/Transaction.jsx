import MainLayout from "../../components/layout/MainLayout.jsx";
import ChangeDate from "../../components/common/ChangeDate.jsx";
import IncomePage from "./IncomePage.jsx";
import ExpensePage from "./ExpensePage.jsx";

import { useTransactionStore } from "../../stores/transaction";
import { useLanguage } from "../../hooks/useLanguage";

export default function Transaction() {
  const month = useTransactionStore((s) => s.month);
  const setMonth = useTransactionStore((s) => s.setMonth);
  const { t } = useLanguage();

  return (
    <MainLayout
      auth={true}
      navbarBottom={true}
      title={t("transactions.pageTitle", "Quản lý chi tiêu và thu nhập")}
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
