import { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Input from "../common/Input";

import { useLanguage } from "../../hooks/useLanguage";

export default function ChangePassword({ open, onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({
        type: "error",
        text: t("setting.formChangePassword.validation.allFieldsRequired"),
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: t(
          "setting.formChangePassword.validation.confirmPasswordMismatch",
        ),
      });
      return;
    }
    if (oldPassword === newPassword) {
      setMessage({
        type: "error",
        text: t("setting.formChangePassword.validation.newPasswordSameAsOld"),
      });
      return;
    }
    setLoading(true);
    // simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage({
      type: "success",
      text: t("setting.formChangePassword.success"),
    });
  };

  return (
    // modal overlay
    <Modal isOpen={open} onClose={onClose}>
      <div className="flex items-center justify-center bg-blue-600 p-4 rounded">
        <h2 className="text-2xl font-semibold text-white">
          {t("setting.formChangePassword.title")}
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full rounded shadow p-6 space-y-4"
      >
        <Input
          label={t("setting.formChangePassword.currentPassword")}
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <Input
          label={t("setting.formChangePassword.newPassword")}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
        />

        <Input
          label={t("setting.formChangePassword.confirmNewPassword")}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />

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
            {t("common.buttons.cancel")}
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading
              ? t("setting.formChangePassword.processing")
              : t("common.buttons.confirm")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
