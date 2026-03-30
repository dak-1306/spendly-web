import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import EmptyFace from "./EmptyFace";

export default function EmptyDashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="relative group">
        {/* Glow effect */}
        <div
          className="
            absolute -inset-1
            bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200
            rounded-3xl blur-xl opacity-0
            group-hover:opacity-40
            transition duration-500
          "
        />

        {/* Card */}
        <div
          className="
            relative
            rounded-2xl
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            shadow-lg
            p-8
            flex flex-col items-center text-center
            transition-all duration-300
            group-hover:-translate-y-1
            group-hover:shadow-xl
          "
        >
          <EmptyFace />

          <h3 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
            Bạn chưa có dữ liệu
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Chưa có giao dịch nào để hiển thị. Thêm giao dịch để xem báo cáo,
            biểu đồ và phân tích thông minh.
          </p>

          <div className="mt-6 flex gap-3">
            <Button variant="cta" onClick={() => navigate("/transaction")}>
              Thêm giao dịch
            </Button>

            <Button
              onClick={() => navigate("/ai")}
              className="bg-white text-blue-600 border border-blue-100 hover:bg-blue-50"
            >
              Khám phá AI
            </Button>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Gợi ý: nhập thủ công hoặc đồng bộ ngân hàng để tự động ghi nhận giao
            dịch.
          </div>
        </div>
      </div>
    </div>
  );
}
