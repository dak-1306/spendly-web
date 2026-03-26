import { motion as Motion } from "framer-motion";
import AICard from "./AICard";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const card = { hidden: { y: 18, opacity: 0 }, show: { y: 0, opacity: 1 } };

export default function AICardGrid({ items = [], onOpen }) {
  return (
    <Motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      {items.map((it, idx) => (
        <Motion.div key={it.id ?? idx} variants={card}>
          <AICard
            id={it.id ?? idx}
            title={it.title}
            color={it.color}
            summary={it.summary}
            onOpen={onOpen}
          />
        </Motion.div>
      ))}
    </Motion.div>
  );
}
