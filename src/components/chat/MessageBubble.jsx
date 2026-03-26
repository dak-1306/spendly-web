import React from "react";
import { motion as Motion } from "framer-motion";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const container = isUser ? "ml-auto text-right" : "mr-auto text-left";

  return (
    <Motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className={`max-w-[85%] ${container}`}
    >
      <div
        className={`inline-block rounded-2xl p-3 text-sm leading-6 ${
          isUser
            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        } shadow-sm`}
      >
        <div>{message.text}</div>
        <div className="text-xs text-gray-400 mt-1">{message.role}</div>
      </div>
    </Motion.li>
  );
}
