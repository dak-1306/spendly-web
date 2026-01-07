import { useState } from "react";
import Button from "../common/Button";
import { X } from "lucide-react";

export default function ChangePassword({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // nếu chưa mở thì không render gì
  if (!open) return null;

  const closeIcon = <X className="w-5 h-5 text-white" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!email || !oldPassword || !newPassword) {
      setMessage({ type: "error", text: "Vui lòng điền đủ thông tin." });
      return;
    }
    if (oldPassword === newPassword) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải khác mật khẩu cũ.",
      });
      return;
    }
    setLoading(true);
    // simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setEmail("");
    setOldPassword("");
    setNewPassword("");
    setMessage({ type: "success", text: "Đổi mật khẩu thành công." });
  };

  return (
    // modal overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-6 rounded shadow"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mb-4">Đổi mật khẩu</h2>
          <Button variant="red" size="sm" onClick={onClose}>
            {closeIcon}
          </Button>
        </div>

        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Mật khẩu hiện tại</span>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm">Mật khẩu mới</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded"
            required
            minLength={6}
          />
        </label>

        {message && (
          <div
            className={`mb-3 text-sm ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <Button
          variant="blue"
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </Button>
      </form>
    </div>
  );
}
