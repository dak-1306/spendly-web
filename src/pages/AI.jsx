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
import AICardGrid from "../components/ai/AICardGrid.jsx";
import AICardDetail from "../components/ai/AICardDetail.jsx";
import AILoader from "../components/ai/AILoader.jsx";

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
  const [openCard, setOpenCard] = useState(null);

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
      const base = buildFinancialPayload({
        monthlyBudget,
        monthFilter: month,
        transactions: transactionCurrent,
      });

      const [yearStr, _MONTH_STR] = (month || "").split("-");
      const metaPayload = {
        ...base,
        analysisType: "BUDGET_ANALYSIS",
        month,
        year: yearStr ? Number(yearStr) : null,
      };

      const res = await fetchOrCompute(metaPayload, run);
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

    // Detect numbered headings that may be wrapped in bold/italic markers
    // e.g. "**1. Tổng quan:**" or "1. Tổng quan:"
    const lines = normalized.split("\n");
    const headingLineIndices = [];
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i].trim();
      if (!raw) continue;
      // Strip wrapping bold/italic markers from both ends
      const stripped = raw
        .replace(/^([*_\s])+/, "")
        .replace(/([*_\s])+$/, "")
        .trim();
      if (/^\d+\.\s+/.test(stripped)) {
        headingLineIndices.push(i);
      }
    }

    if (headingLineIndices.length > 0) {
      const sections = [];
      for (let idx = 0; idx < headingLineIndices.length; idx++) {
        const start = headingLineIndices[idx];
        const end =
          idx + 1 < headingLineIndices.length
            ? headingLineIndices[idx + 1]
            : lines.length;
        const blockLines = lines.slice(start, end);
        const headingRaw = blockLines[0].trim();
        const heading = headingRaw
          .replace(/^([*_\s])+/, "")
          .replace(/([*_\s])+$/, "")
          .replace(/^#{1,6}\s*/, "")
          .trim();
        const body = blockLines.slice(1).join("\n").trim();
        sections.push({ heading, body });
      }
      return sections;
    }

    // Last-resort fallback: return the whole text as a single section (no heading)
    return [{ heading: "Báo cáo", body: normalized }];
  }

  // Map parsed sections into 4-card layout (overview, hotspots, advice, message)
  function buildCardsFromResult(text) {
    const parsed = parseAIResult(text);
    const map = { overview: null, hotspots: null, advice: null, message: null };

    parsed.forEach((p) => {
      const key = p.heading.toLowerCase();
      if (key.includes("tổng quan") || key.includes("tổng quan"))
        map.overview = p;
      else if (key.includes("điểm nóng") || key.includes("điểm"))
        map.hotspots = p;
      else if (key.includes("lời khuyên") || key.includes("lời"))
        map.advice = p;
      else if (key.includes("thông điệp") || key.includes("thông"))
        map.message = p;
    });

    // Fallback: distribute if some are missing
    const defaults =
      Object.values(map).filter(Boolean).length === 0
        ? [{ heading: "Báo cáo", body: text }]
        : parsed;

    const cards = [
      {
        id: "overview",
        title: "Tổng quan",
        color: "bg-gradient-to-tr from-blue-500 to-indigo-500",
        summary: (map.overview || defaults[0]).heading,
        content: (map.overview || defaults[0]).body,
      },
      {
        id: "hotspots",
        title: "Điểm nóng",
        color: "bg-gradient-to-tr from-red-500 to-orange-500",
        summary: (map.hotspots || defaults[1] || defaults[0]).heading,
        content: (map.hotspots || defaults[1] || defaults[0]).body,
      },
      {
        id: "advice",
        title: "Lời khuyên",
        color: "bg-gradient-to-tr from-yellow-500 to-amber-500",
        summary: (map.advice || defaults[2] || defaults[0]).heading,
        content: (map.advice || defaults[2] || defaults[0]).body,
      },
      {
        id: "message",
        title: "Thông điệp",
        color: "bg-gradient-to-tr from-green-500 to-emerald-500",
        summary: (map.message || defaults[3] || defaults[0]).heading,
        content: (map.message || defaults[3] || defaults[0]).body,
      },
    ];

    return cards;
  }

  // Automatic monthly AI analysis on page open (or when transactions load)
  useEffect(() => {
    let mounted = true;
    async function autoAnalyze() {
      try {
        if (!transactionCurrent || !transactionCurrent.length) return;
        // If already have a result (from cache or manual), skip
        if (finalResult) return;

        const base = buildFinancialPayload({
          transactions: transactionCurrent,
        });
        const [yearStr, _MONTH_STR] = (month || "").split("-");
        const metaPayload = {
          ...base,
          analysisType: "AUTO_MONTHLY_ANALYSIS",
          month,
          year: yearStr ? Number(yearStr) : null,
        };

        const res = await fetchOrCompute(metaPayload, run);
        if (mounted) setFinalResult(res);
      } catch (err) {
        console.error("Auto analysis failed:", err);
      }
    }

    autoAnalyze();
    return () => {
      mounted = false;
    };
  }, [transactionCurrent, month, fetchOrCompute, run, finalResult]);

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
            <AILoader />
          </div>
        )}
        {finalResult && (
          <Motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-8"
          >
            <AICardGrid
              items={buildCardsFromResult(finalResult)}
              onOpen={(id) => setOpenCard(id)}
            />
            <AICardDetail
              open={Boolean(openCard)}
              onClose={() => setOpenCard(null)}
              title={openCard}
              color={
                (
                  buildCardsFromResult(finalResult).find(
                    (c) => c.id === openCard,
                  ) || {}
                ).color || "bg-white"
              }
              content={
                (
                  buildCardsFromResult(finalResult).find(
                    (c) => c.id === openCard,
                  ) || {}
                ).content || finalResult
              }
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
