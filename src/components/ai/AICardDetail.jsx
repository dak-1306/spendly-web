import {
  motion as Motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import ReactMarkdown from "react-markdown";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.24, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.36, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: { duration: 0.26, ease: "easeIn" },
  },
};

export default function AICardDetail({ open, onClose, title, content, color }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <Motion.div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <Motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            variants={backdropVariants}
            initial="hidden"
            animate={reduce ? undefined : "visible"}
            exit={reduce ? undefined : "exit"}
          />

          <Motion.div
            className={`relative max-w-4xl w-full ${color} dark:bg-gray-900 rounded-xl shadow-2xl p-6 overflow-auto`}
            variants={reduce ? {} : modalVariants}
            initial={reduce ? undefined : "hidden"}
            animate={reduce ? undefined : "visible"}
            exit={reduce ? undefined : "exit"}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="text-sm text-white/90 hover:text-white transition"
              >
                Close
              </button>
            </div>

            <div className="prose max-w-none dark:prose-invert text-white/90 dark:text-white">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
