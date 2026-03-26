import { motion as Motion } from "framer-motion";

export default function AILoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <Motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="w-40 h-24 rounded-xl bg-gradient-to-r from-blue-400 to-purple-600 shadow-2xl flex items-center justify-center text-white font-semibold"
      >
        AI đang phân tích...
      </Motion.div>
    </div>
  );
}
