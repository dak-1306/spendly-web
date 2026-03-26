import { useState } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import { useChat } from "../hooks/useChat";

export default function ChatPage() {
  const { messages, loading, error, sendMessage, clear } = useChat();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    try {
      await sendMessage(text);
      setInput("");
    } catch (err) {
      console.error("Chat send error:", err);
      alert("Lỗi khi gửi tin nhắn. Vui lòng thử lại.");
    }
  };

  return (
    <MainLayout auth navbarBottom title="Chat with AI">
      <div className="mx-6 my-6 max-w-3xl">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">AI Chat</h2>
          <div>
            <Button variant="ghost" size="sm" onClick={clear}>
              Clear
            </Button>
          </div>
        </div>

        <div className="border rounded p-4 h-[60vh] overflow-auto mb-4 bg-white dark:bg-gray-800">
          {messages.length === 0 && (
            <div className="text-sm text-gray-500">
              Bắt đầu cuộc trò chuyện...
            </div>
          )}
          <ul className="space-y-3">
            {messages.map((m, idx) => (
              <li
                key={idx}
                className={`p-2 rounded ${
                  m.role === "user"
                    ? "bg-blue-50 text-right"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-gray-400 mt-1">{m.role}</div>
              </li>
            ))}
          </ul>
        </div>

        {error && <div className="text-red-500 mb-2">Lỗi: {String(error)}</div>}

        <div className="flex gap-2">
          <Input
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} disabled={loading} variant="primary">
            {loading ? "Đang gửi..." : "Gửi"}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
