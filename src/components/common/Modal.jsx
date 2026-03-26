import { useEffect } from "react";
import {
  motion as Motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

const panel = {
  hidden: { opacity: 0, y: 18, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.99,
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

function Modal({ isOpen, onClose, children }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            variants={backdrop}
            initial="hidden"
            animate={reduce ? undefined : "visible"}
            exit={reduce ? undefined : "exit"}
          />

          <Motion.div
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
            variants={reduce ? {} : panel}
            initial={reduce ? undefined : "hidden"}
            animate={reduce ? undefined : "visible"}
            exit={reduce ? undefined : "exit"}
          >
            <div className="flex flex-col">{children}</div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
