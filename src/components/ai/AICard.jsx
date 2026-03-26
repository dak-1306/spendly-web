import { motion as Motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function AICard({ id, title, color, summary, onOpen }) {
  return (
    <Motion.div
      layout
      whileHover={{ scale: 1.02, y: -6 }}
      className={`relative rounded-xl p-4 shadow-lg cursor-pointer overflow-hidden ${color}`}
      onClick={() => onOpen(id)}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-white/90">{title}</div>
          <div className="mt-2 text-white/90 text-sm">{summary}</div>
        </div>
        <div className="flex items-center">
          <ChevronRight className="text-white/90" />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 opacity-10 blur-2xl"
        style={{ background: color }}
      />
    </Motion.div>
  );
}
