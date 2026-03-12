import Button from "./Button";
import { useCallback } from "react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { newMonth } from "../../utils/date";

function ChangeDate({ month, setMonth }) {
  const prevIcon = <ArrowBigLeft className="w-5 h-5 text-blue-500" />;
  const nextIcon = <ArrowBigRight className="w-5 h-5 text-blue-500" />;
  // handlers chuyển tháng (useCallback để stable reference khi truyền xuống con)
  const handlePrevMonth = useCallback(() => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 2);

    setMonth(newMonth({ d }));
  }, [month, setMonth]);

  const handleNextMonth = useCallback(() => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m);

    setMonth(newMonth({ d }));
  }, [month, setMonth]);
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={handlePrevMonth}>
        {prevIcon}
      </Button>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border border-blue-500 text-blue-500 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
      />

      <Button variant="outline" onClick={handleNextMonth}>
        {nextIcon}
      </Button>
    </div>
  );
}

export default ChangeDate;
