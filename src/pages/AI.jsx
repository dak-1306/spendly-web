import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Chat from "../components/ai/Chat.jsx";
import { ICONS } from "../assets/index.js";
import { useFinancialReport } from "../hooks/useFinancialReport";
import { useTransaction } from "../hooks/useTransaction";
import { buildFinancialPayload } from "../utils/ai.transform.js";
import { useAuth } from "../hooks/useAuth.js";
import { useLanguage } from "../hooks/useLanguage";
import ReactMarkdown from "react-markdown";
import { useFirebaseAI } from "../hooks/useFirebaseAI.js";
import Accordion from "../components/common/Accordion.jsx";

import FinancePreviewAnimation from "../components/canvas/FinancePreviewAnimation.jsx";
import AILoadingAnimation from "../components/canvas/AILoadingAnimation.jsx";
import { motion as Motion } from "framer-motion";
import { container, item } from "../motion.config";

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
  const { t } = useLanguage();
  const quickOptions = t("ai.quickOptions");

  const handleAnalyze = async () => {
    if (!transactionCurrent?.length) {
      alert(
        t(
          "ai.emptyTransactionsAlert",
          "Dữ liệu giao dịch đang tải hoặc trống!",
        ),
      );
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
      alert(
        t(
          "ai.analysisErrorAlert",
          "Có lỗi xảy ra khi phân tích. Vui lòng thử lại sau.",
        ),
      );
    }
  };

  // Parse AI result into top-level numbered sections.
  // Prefer headings that include markdown header markers (e.g., "#### 1. ...")
  // so nested numbered lists inside a section are not split out. If no
  // hash-headings are present, fall back to splitting at blank-line + number.
  function parseAIResult(text) {
    if (!text) return [];
    const normalized = text.replace(/\r\n/g, "\n").trim();

    // Regex to detect markdown headings like "# 1. Title" or "#### 3. Title"
    const hashHeadingRegex = /^#{1,6}\s*\d+\.\s.*$/gm;
    if (hashHeadingRegex.test(normalized)) {
      // Collect heading line match indices
      const matches = [...normalized.matchAll(/^#{1,6}\s*\d+\.\s.*$/gm)];
      const sections = [];
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const start = match.index;
        const end =
          i + 1 < matches.length ? matches[i + 1].index : normalized.length;
        const block = normalized.slice(start, end).trim();
        const lines = block.split("\n");
        const headingLine = lines[0].replace(/^#{1,6}\s*/, "").trim();
        const heading = headingLine;
        const body = lines.slice(1).join("\n").trim();
        sections.push({ heading, body });
      }
      return sections;
    }

    // Fallback: split at start or blank line followed by a numbered heading.
    const parts = normalized
      .split(/(?=(?:^|\n\n)\d+\.\s)/g)
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

  console.log("finalResult =", finalResult);
  return (
    <MainLayout auth navbarBottom title={t("ai.pageTitle")}>
      <div className="space-y-6 mx-10">
        <Motion.div variants={container} initial="hidden" animate="show">
          <Card>
            <Motion.div
              variants={item}
              initial="hidden"
              animate="show"
              className="flex flex-wrap items-center gap-4"
            >
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                placeholder={t("ai.budgetPlaceholder", "Ngân sách (VND)")}
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none flex-1"
              />
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                variant="primary"
              >
                {loading
                  ? t("ai.analyzing", "Đang xử lý...")
                  : t("ai.analyzeButton", "Phân tích bằng AI")}
              </Button>
            </Motion.div>
          </Card>
        </Motion.div>
        {error && (
          <div className="text-red-500 mt-4 text-sm">Lỗi: {error.message}</div>
        )}

        {loading && (
          <div className="mt-8">
            <AILoadingAnimation />
          </div>
        )}
        {finalResult && (
          <Motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-8"
          >
            <Accordion
              items={parseAIResult(finalResult).map((sec, idx) => ({
                id: idx,
                title: sec.heading,
                content: sec.body,
              }))}
            />
          </Motion.div>
        )}
        {!finalResult && !loading && <FinancePreviewAnimation />}
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
