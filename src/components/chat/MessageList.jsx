import { useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages = [], isTyping }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new message arrives
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div ref={containerRef} className="h-[60vh] overflow-auto p-3">
      <AnimatePresence initial={false} mode="popLayout">
        <ul className="space-y-3">
          {messages.map((m) => (
            <MessageBubble
              key={m.id ?? m._tempId ?? Math.random()}
              message={m}
            />
          ))}
          {isTyping && (
            <Motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mr-auto"
            >
              <div className="inline-block rounded-2xl p-3 bg-gray-100 dark:bg-gray-800 text-sm shadow-sm">
                <span className="animate-pulse">AI is typing...</span>
              </div>
            </Motion.li>
          )}
        </ul>
      </AnimatePresence>
    </div>
  );
}
