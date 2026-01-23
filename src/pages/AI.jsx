import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import Card from "../components/common/Card.jsx";
import Chat from "../components/ai/Chat.jsx";
import { AI_CONSTANTS } from "../utils/constants.js";
import { ICONS } from "../assets/index.js";
import { useFinancialReport } from "../hooks/useFinancialReport";
import useTransaction from "../hooks/useTransaction"; // <-- added
import ReactMarkdown from "react-markdown";
import { buildFinancialPayload } from "../services/ai.transform"; // <-- added

/*
  AI.jsx
  - Trang trợ lý AI: hiển thị tổng quan + nút mở chat
  - Mục tiêu: sạch, dễ đọc, dùng constants và component ref từ utils/constants
  - Ghi chú: Robot icon là component (lucide), không dùng <img> từ assets
*/

export default function AI() {
  // lấy transactions thật từ context
  const { transactions: allTransactions = [] } = useTransaction();

  // trạng thái modal chat
  const [chatOpen, setChatOpen] = useState(false);

  const robotIcon = ICONS.icon_robot_color;

  // quick options từ constants
  const quickOptions = AI_CONSTANTS.QUICK_OPTIONS;

  // NEW: hook for AI financial report
  const { run, loading, error, result } = useFinancialReport();
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [monthFilter, setMonthFilter] = useState("");

  async function handleAnalyze() {
    if (!allTransactions || allTransactions.length === 0) {
      alert(
        "Dữ liệu giao dịch đang được tải hoặc không tồn tại. Vui lòng đợi trong giây lát!",
      );
      return;
    }

    const monthForTransform = monthFilter || null;
    const budgetNumber = Number(monthlyBudget || 0);

    const payload = buildFinancialPayload(
      allTransactions,
      budgetNumber,
      monthForTransform,
    );

    // DEBUG: log payload trước khi gửi
    console.log("Payload gửi lên AI/financial (before run):", payload);

    try {
      const res = await run(payload); // run có thể serialize/transform payload bên trong
      // DEBUG: log response trả về từ hook/run
      console.log("Response từ useFinancialReport.run:", res);
    } catch (err) {
      console.error("AI analyze error:", err);
    }
  }

  return (
    <MainLayout
      auth={true}
      navbarBottom={true}
      title={AI_CONSTANTS.PAGE_TITLE.vi}
    >
      {/* Nội dung chính: các thẻ tổng quan */}
      <div className="space-y-6 mx-10">
        {/* Controls for AI analysis */}
        <Card>
          <div className="flex items-center gap-4">
            <input
              type="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="border px-2 py-1"
            />
            <input
              type="number"
              placeholder="Ngân sách mục tiêu (VND)"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="border px-2 py-1"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Đang phân tích..." : "Phân tích bằng AI"}
            </button>
          </div>

          {error && (
            <div className="text-red-600 mt-2">
              Lỗi: {error.message || String(error)}
            </div>
          )}

          {result && (
            <Card className="mt-4 border-t-4 border-blue-500">
              <div>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span>✨</span> Kết quả phân tích từ Trợ lý Spendly
                </h3>
                <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>
            </Card>
          )}
        </Card>
      </div>

      {/* Nút mở chat: dùng RobotIcon component, có aria-label cho accessibility */}
      <button
        onClick={() => setChatOpen(true)}
        aria-label="Mở chat trợ lý AI"
        className="fixed bottom-24 right-10 p-[1px] bg-linear-color rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
      >
        <div className="px-4 py-5 bg-white rounded-full">
          <img src={robotIcon.src} alt={robotIcon.alt} />
        </div>
      </button>

      {/* Chat modal */}
      <Chat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        option={quickOptions}
      />
    </MainLayout>
  );
}
