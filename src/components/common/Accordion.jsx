import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Plus, Minus } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { container, item } from "../../motion.config";

export default function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((it, idx) => {
        const isOpen = openIndex === idx;
        return (
          <Motion.div
            variants={container}
            initial="hidden"
            animate="show"
            key={it.id ?? idx}
            className="border rounded-lg shadow-sm overflow-hidden"
            layout
          >
            <Motion.button
              variants={item}
              initial="hidden"
              animate="show"
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                  {idx + 1}
                </div>
                <div className="text-left font-semibold text-gray-800 dark:text-gray-100">
                  {it.title}
                </div>
              </div>
              <div className="text-blue-500 dark:text-blue-400">
                {isOpen ? <Minus /> : <Plus />}
              </div>
            </Motion.button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <Motion.div
                  key={`content-${it.id ?? idx}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                  role="region"
                  className="bg-gray-50 dark:bg-gray-900"
                >
                  <Motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="p-4 prose prose-slate dark:prose-invert max-w-none"
                  >
                    <ReactMarkdown>{it.content}</ReactMarkdown>
                  </Motion.div>
                </Motion.div>
              )}
            </AnimatePresence>
          </Motion.div>
        );
      })}
    </div>
  );
}
