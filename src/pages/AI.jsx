import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Chat from "../components/ai/Chat.jsx";
import { AI_CONSTANTS } from "../utils/constants.js";
import { ICONS } from "../assets/index.js";
import { useFinancialReport } from "../hooks/useFinancialReport";
import { useTransaction } from "../hooks/useTransaction";
import { buildFinancialPayload } from "../services/ai.transform.js";
import { useAuth } from "../hooks/useAuth.js";
import ReactMarkdown from "react-markdown";
import { useFirebaseAI } from "../hooks/useFirebaseAI.js";

import FinancePreviewAnimation from "../components/canvas/FinancePreviewAnimation.jsx";
import AILoadingAnimation from "../components/canvas/AILoadingAnimation.jsx";

export default function AI() {
  const { transactionCurrent, month, setMonth, fetchTransactionCurrent } =
    useTransaction();
  const { fetchOrCompute } = useFirebaseAI();
  const [chatOpen, setChatOpen] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(0);

  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    fetchTransactionCurrent(userId, month);
  }, [fetchTransactionCurrent, userId, month]);

  // State duy nhất quản lý nội dung hiển thị (từ cache hoặc từ AI mới)
  const [finalResult, setFinalResult] = useState("");

  const { run, loading, error } = useFinancialReport();
  const robotIcon = ICONS.icon_robot_color;
  const quickOptions = AI_CONSTANTS.QUICK_OPTIONS;

  const handleAnalyze = async () => {
    if (!transactionCurrent?.length) {
      alert("Dữ liệu giao dịch đang tải hoặc trống!");
      return;
    }

    // Reset kết quả cũ để người dùng thấy trạng thái đang xử lý mới
    setFinalResult("");

    try {
      const payload = buildFinancialPayload({
        monthlyBudget,
        monthFilter: month,
        transactions: transactionCurrent,
      });
      const res = await fetchOrCompute(payload, run);
      setFinalResult(res);
    } catch (err) {
      console.error("Lỗi khi phân tích tài chính:", err);
      // Lỗi đã được xử lý trong hook useFinancialReport, chỉ cần hiển thị thông báo chung
      alert("Có lỗi xảy ra khi phân tích. Vui lòng thử lại sau.");
    }
  };

  // Hàm parse được cải tiến: linh hoạt hơn với format của AI
  function parseAIResult(text) {
    if (!text) return [];
    const normalized = text.replace(/\r\n/g, "\n").trim();

    // Split trước vị trí của "1. " / "2. " ... cho cả trường hợp có hoặc không có newline trước
    const parts = normalized
      .split(/(?=\n?\d+\.\s)/g)
      .map((p) => p.trim())
      .filter(Boolean);

    const sections = parts.filter((p) => /^\d+\.\s/.test(p));
    return sections.map((s) => {
      const lines = s.split("\n");
      const heading = lines[0].trim();
      const body = lines.slice(1).join("\n").trim();
      return { heading, body };
    });
  }

  console.log(
    "Render AI page with transactions:",
    transactionCurrent,
    "and month:",
    month,
    "and payload:",
    buildFinancialPayload({
      monthlyBudget,
      transactions: transactionCurrent,
    }),
  );

  return (
    <MainLayout auth navbarBottom title={AI_CONSTANTS.PAGE_TITLE.vi}>
      <div className="space-y-6 mx-10">
        <Card>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="number"
              placeholder="Ngân sách (VND)"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none flex-1"
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              variant="primary"
            >
              {loading ? "Đang xử lý..." : "Phân tích bằng AI"}
            </Button>
          </div>
          {error && (
            <div className="text-red-500 mt-4 text-sm">
              Lỗi: {error.message}
            </div>
          )}

          {loading && (
            <div className="mt-8">
              <AILoadingAnimation />
            </div>
          )}
          {finalResult && (
            <div className="mt-8 space-y-6 animate-in fade-in duration-500">
              {parseAIResult(finalResult).map((sec, idx) => (
                <div
                  key={idx}
                  className="border-l-4 border-blue-500 shadow-sm pl-4 py-1"
                >
                  <h3 className="font-bold text-xl text-gray-800 dark:text-gray-300 mb-2">
                    {sec.heading}
                  </h3>
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown>{sec.body}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        {!finalResult && <FinancePreviewAnimation />}
      </div>

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-24 right-10 p-1 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full shadow-2xl hover:scale-110 transition-transform"
      >
        <div className="p-4 bg-white dark:bg-gray-800 rounded-full">
          <img src={robotIcon.src} alt="AI Robot" className="w-8 h-8" />
        </div>
      </button>

      <Chat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        option={quickOptions}
      />
    </MainLayout>
  );
}
