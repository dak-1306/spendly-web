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
      <Button variant="primary" onClick={onPrev}>
        {prevIcon}
      </Button>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border rounded px-2 py-1"
      />

      <Button variant="primary" onClick={onNext}>
        {nextIcon}
      </Button>
    </div>
  );
}

export default ChangeDate;
