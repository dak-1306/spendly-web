import Button from "./Button";
import { useCallback } from "react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { newMonth } from "../../utils/date";

function ChangeDate({ month, setMonth }) {
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
    <div className="flex items-center gap-3 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 w-fit">
      <Button variant="ghost" className="p-2" onClick={handlePrevMonth}>
        <ArrowBigLeft className="w-5 h-5 text-blue-500" />
      </Button>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="
          bg-transparent
          border border-gray-300 dark:border-gray-500
          rounded-md
          px-3 py-1.5
          text-sm
          text-gray-700 dark:text-gray-200
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          transition
        "
      />

      <Button variant="ghost" className="p-2" onClick={handleNextMonth}>
        <ArrowBigRight className="w-5 h-5 text-blue-500" />
      </Button>
    </div>
  );
}

export default ChangeDate;
