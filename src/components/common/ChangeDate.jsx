import Button from "./Button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

function ChangeDate({ month, setMonth, onPrev, onNext }) {
  const prevIcon = (
    <ArrowBigLeft className="w-5 h-5 text-[var(--primary-blue-color)]" />
  );
  const nextIcon = (
    <ArrowBigRight className="w-5 h-5 text-[var(--primary-blue-color)]" />
  );
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onPrev}>
        {prevIcon}
      </Button>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border border-blue-500 text-blue-500 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
      />

      <Button variant="outline" onClick={onNext}>
        {nextIcon}
      </Button>
    </div>
  );
}

export default ChangeDate;
