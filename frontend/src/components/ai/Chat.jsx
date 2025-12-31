import { ICONS } from "../../assets/index.js";
import Button from "../common/Button.jsx";
import LineColor from "../common/LineColor.jsx";
import { useState } from "react";
function Chat({ open, onClose, option }) {
  const ROBOT_ICON = ICONS.icon_robot_color;
  const SUBMIT_ICON = ICONS.icon_submit;
  const CLOSE_ICON = ICONS.icon_delete;
  const [inputValue, setInputValue] = useState("");
  const [answerList, setAnswerList] = useState([]);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSubmit = () => {
    if (inputValue.trim() === "") return;
    // Xử lý gửi câu hỏi đến AI ở đây
    console.log("Câu hỏi đã gửi:", inputValue);
    // Thêm câu hỏi và câu trả lời giả lập vào danh sách
    setAnswerList([
      ...answerList,
      { question: inputValue, answer: "Đây là câu trả lời giả lập từ AI." },
    ]);
    setInputValue("");
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div
        className="relative m-6 bg-white rounded-xl shadow-lg overflow-hidden"
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
            <img
              src={CLOSE_ICON.src}
              alt={CLOSE_ICON.alt}
              width={CLOSE_ICON.width}
              height={CLOSE_ICON.height}
            />
          </Button>
        </div>
        <LineColor />
        <div className="h-[500px] py-4 px-16 flex flex-col">
          <ol className="p-4 overflow-auto">
            {option.map((item, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 p-2 mb-2 border border-[var(--secondary-blue-color)] rounded-md"
              >
                {item}
              </li>
            ))}
          </ol>
          <LineColor />
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {answerList.map((item, index) => (
              <div className="w-full space-y-2" key={index}>
                <p className="font-semibold flex justify-end p-1">
                  <span className="p-2 border border-[var(--secondary-green-color)] rounded-md">
                    Bạn: {item.question}
                  </span>
                </p>
                <p className="font-semibold flex justify-start p-2 border border-[var(--secondary-green-color)] rounded-md">
                  AI: {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
        <LineColor />
        <div className="px-4 py-3">
          <div className="flex gap-2">
            <input
              className="flex-1 border border-[var(--primary-green-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-green-color)] rounded px-3 py-2 text-sm"
              placeholder="Nhập câu hỏi..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <Button variant="gradient" size="sm" onClick={handleSubmit}>
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
    </div>
  );
}
export default Chat;
