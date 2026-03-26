import { motion as Motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <Motion.div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150" />
      <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse delay-300" />
    </Motion.div>
  );
}
