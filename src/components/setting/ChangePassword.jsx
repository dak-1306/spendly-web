import { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";

export default function ChangePassword({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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
    <Modal isOpen={open} onClose={onClose}>
      
        <div className="flex items-center justify-center bg-blue-600 p-4 rounded">
          <h2 className="text-2xl font-semibold text-white">Đổi mật khẩu</h2>
          
        </div>
<form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white rounded shadow p-6"
      >
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
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Hủy
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
