import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EditTransaction from "../components/transaction/EditTransaction.jsx";
import DeleteTransaction from "../components/transaction/DeleteTransaction.jsx";
import { useTransaction } from "../hooks/useTransaction";
import { useParams, useNavigate } from "react-router-dom";

import { Trash2, Edit2, ArrowBigLeft } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

import { motion as Motion } from "framer-motion";
import { container } from "../motion.config";

import { useState, useEffect } from "react";

export default function TransactionDetail() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { getTransactionById, loading } = useTransaction();
  const [transaction, setTransaction] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await getTransactionById(transactionId);
        setTransaction(data);
      } catch (e) {
        console.error("Failed to fetch transaction:", e);
      }
    };
    fetchTransaction();
  }, [transactionId, getTransactionById]);
  console.log("TransactionDetail: transaction =", transaction);

  const { t } = useLanguage();

  if (loading || !transaction) {
    return (
      <MainLayout
        title={t("common.transactionDetailTitle", "Transaction Detail")}
        auth={true}
        navbarBottom={true}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">
            {t("common.loading", "Loading...")}
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={t("common.transactionDetailTitle", "Transaction Detail")}
      auth={true}
      navbarBottom={true}
    >
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowBigLeft className="mr-2" size={24} />
        {t("common.back", "Back")}
      </Button>
      <Motion.div variants={container} initial="hidden" animate="show">
        <Card>
          <h2 className="text-xl font-semibold">{transaction.title}</h2>
          <p className="text-lg text-yellow-500 font-bold">
            ${transaction.amount.toFixed(2)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {transaction.type === "income"
              ? t("common.sourceIncome", "Nguồn thu nhập")
              : t("common.expenseDescription", "Mô tả chi tiêu")}
            : {transaction.source}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {t("common.currencyLabel", "Loại tiền")}: {transaction.currency}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {t("common.categoryLabel", "Danh mục")}: {transaction.category}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {t("common.transactionDateLabel", "Ngày giao dịch")}:{" "}
            {new Date(transaction.date.seconds * 1000).toLocaleDateString()}
          </p>
          <div className="mt-4 flex space-x-2">
            <Button variant="primary" onClick={() => setEditOpen(true)}>
              <Edit2 className="mr-1" size={16} />
              {t("transactions.buttons.edit", "Sửa")}
            </Button>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-1" size={16} />
              {t("transactions.buttons.delete", "Xóa")}
            </Button>
          </div>
        </Card>
      </Motion.div>
      <EditTransaction
        open={editOpen}
        onClose={() => setEditOpen(false)}
        role={transaction.type}
        data={transaction}
      />
      <DeleteTransaction
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        role={transaction.type}
        item={transaction}
      />
    </MainLayout>
  );
}
