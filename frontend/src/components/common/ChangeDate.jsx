import Button from "./Button";

function ChangeDate({ month, setMonth, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="primary" onClick={onPrev}>
        Trước
      </Button>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border rounded px-2 py-1"
      />

      <Button variant="primary" onClick={onNext}>
        Sau
      </Button>
    </div>
  );
}

export default ChangeDate;
