import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function Composer({ value, onChange, onSend, disabled }) {
  const [text, setText] = useState(value || "");
  const taRef = useRef(null);

  useEffect(() => setText(value || ""), [value]);

  function submit() {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  }

  return (
    <div className="flex gap-2 items-end">
      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={2}
        placeholder="Nhập tin nhắn..."
        className="flex-1 resize-none border rounded p-3 bg-white dark:bg-gray-800"
      />
      <button
        onClick={submit}
        disabled={disabled}
        className="p-3 rounded-lg bg-blue-600 text-white disabled:opacity-60"
        aria-label="Send"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
