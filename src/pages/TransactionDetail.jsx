import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EditModel from "../components/transaction/EditModel";
import DeleteModel from "../components/transaction/Delete.jsx";
import { useTransaction } from "../hooks/useTransaction";
import { useParams, useNavigate } from "react-router-dom";

import { Trash2, Edit2, ArrowBigLeft } from "lucide-react";

import { useState, useEffect } from "react";

export default function TransactionDetail() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { getTransactionById } = useTransaction();
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

  if (!transaction) {
    return (
      <MainLayout>
        <Card>
          <p>Loading...</p>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Transaction Detail" auth={true} navbarBottom={true}>
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowBigLeft className="mr-2" size={24} />
        back
      </Button>
      <Card>
        <h2 className="text-xl font-semibold">{transaction.title}</h2>
        <p className="text-lg text-yellow-500 font-bold">
          ${transaction.amount.toFixed(2)}
        </p>
        <p className="text-gray-600">
          {transaction.type === "income" ? "Nguồn thu nhập" : "Mô tả chi tiêu"}:{" "}
          {transaction.source}
        </p>
        <p className="text-gray-600">Loại tiền: {transaction.currency}</p>
        <p className="text-gray-600">Danh mục: {transaction.category}</p>
        <p className="text-gray-600">
          Ngày giao dịch:{" "}
          {new Date(transaction.date.seconds * 1000).toLocaleDateString()}
        </p>
        <div className="mt-4 flex space-x-2">
          <Button variant="primary" onClick={() => setEditOpen(true)}>
            <Edit2 className="mr-1" size={16} />
            Sửa
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-1" size={16} />
            Xóa
          </Button>
        </div>
      </Card>
      <EditModel
        open={editOpen}
        onClose={() => setEditOpen(false)}
        role={transaction.type}
        data={transaction}
      />
      <DeleteModel
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        role={transaction.type}
        item={transaction}
      />
    </MainLayout>
  );
}
