import { ICONS } from "../../assets/index.js";
import Button from "../common/Button.jsx";
import LineColor from "../common/LineColor.jsx";
import Input from "../common/Input.jsx";
import { X } from "lucide-react";
import { useState } from "react";
import { useChat } from "../../hooks/useChat";

function Chat({ open, onClose, option }) {
  const ROBOT_ICON = ICONS.icon_robot_color;
  const SUBMIT_ICON = ICONS.icon_submit;
  const CLOSE_ICON = <X className="w-5 h-5 text-white" />;
  const [inputValue, setInputValue] = useState("");
  const { messages, sendMessage, loading, error } = useChat();

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleSubmit = async () => {
    if (inputValue.trim() === "") return;
    try {
      await sendMessage(inputValue);
      setInputValue("");
    } catch (err) {
      console.error("Chat send error:", err);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
    }
  };

  const handleOptionClick = async (text) => {
    try {
      await sendMessage(text);
    } catch (err) {
      console.error("Option send error:", err);
    }
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end w-screen h-screen bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div
        className="relative m-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src={ROBOT_ICON.src}
              alt={ROBOT_ICON.alt}
              width={ROBOT_ICON.width}
              height={ROBOT_ICON.height}
            />
            <span className="font-medium">AI Assistant</span>
          </div>
          <Button onClick={onClose} variant="red" size="sm">
            {CLOSE_ICON}
          </Button>
        </div>
        <LineColor />
        <div className="h-[500px] py-4 px-16 flex flex-col">
          <ol className="p-4 overflow-auto">
            {option.map((item, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(item)}
                className="text-sm p-2 mb-2 border border-blue-500 rounded-md cursor-pointer hover:bg-blue-50"
              >
                {item}
              </li>
            ))}
          </ol>
          <LineColor />
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, index) => (
              <div className="w-full space-y-2" key={index}>
                {m.role === "user" ? (
                  <p className="font-semibold flex justify-end p-1">
                    <span className="p-2 border border-blue-500 rounded-md">
                      Bạn: {m.text}
                    </span>
                  </p>
                ) : (
                  <p className="font-semibold flex justify-start p-2 border border-blue-500 rounded-md">
                    AI: {m.text}
                  </p>
                )}
              </div>
            ))}

            {loading && (
              <div className="w-full space-y-2">
                <p className="font-semibold flex justify-start p-2 border border-blue-500 rounded-md">
                  AI đang trả lời...
                </p>
              </div>
            )}
          </div>
        </div>
        <LineColor />
        <div className="flex gap-2 px-4 py-3">
          <Input
            className="flex-1"
            placeholder="Nhập câu hỏi..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            disabled={loading}
          />
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            <img
              src={SUBMIT_ICON.src}
              alt={SUBMIT_ICON.alt}
              width={SUBMIT_ICON.width}
              height={SUBMIT_ICON.height}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
export default Chat;
