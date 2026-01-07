import React, { useState, useMemo, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ChangePassword from "../components/setting/ChangePassword";
import DeleteConfirm from "../components/common/DeleteConfirm";
import { SETTINGS } from "../utils/constants";

/*
  Setting.jsx
  - Cleaned: tách component icon refs, memoize JSX icons
  - Chú thích tiếng Việt, callbacks ổn định (useCallback)
  - Dữ liệu cứng lấy từ SETTINGS (utils/constants)
*/

export default function Setting() {
  // constants từ file chung -> dễ bảo trì / i18n
  const { PAGE_TITLE, HEADINGS, USER_INFO, UI_SETTINGS, TEXTS, ICONS } =
    SETTINGS;

  /* ---------- Icon component refs (từ constants) ----------
     - ICONS chứa các component React (lucide)
     - map sang tên rõ ràng và memoize JSX để tránh recreate mỗi render
  */
  const {
    USER: UserIconComp,
    EMAIL: EmailIconComp,
    TRASH: TrashIconComp,
    AVATAR_EMPTY: AvatarIconComp,
    KEY: KeyIconComp,
    LOGOUT: LogoutIconComp,
  } = ICONS;

  const AvatarIcon = useMemo(
    () => (
      <AvatarIconComp className="w-24 h-24 text-[var(--primary-blue-color)]" />
    ),
    [AvatarIconComp]
  );
  const UserIcon = useMemo(
    () => <UserIconComp className="w-6 h-6 text-[var(--primary-blue-color)]" />,
    [UserIconComp]
  );
  const EmailIcon = useMemo(
    () => (
      <EmailIconComp className="w-6 h-6 text-[var(--primary-green-color)]" />
    ),
    [EmailIconComp]
  );
  const KeyIcon = useMemo(
    () => <KeyIconComp className="w-6 h-6 text-[var(--primary-green-color)]" />,
    [KeyIconComp]
  );
  const TrashIcon = useMemo(
    () => <TrashIconComp className="w-6 h-6 text-[var(--red-color)]" />,
    [TrashIconComp]
  );
  const LogoutIcon = useMemo(
    () => (
      <LogoutIconComp className="w-6 h-6 text-[var(--primary-blue-color)]" />
    ),
    [LogoutIconComp]
  );

  /* ---------- Modal state (đơn giản, dễ hiểu) ---------- */
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null); // "account" | "logout" | null

  /* ---------- Callbacks mở/đóng modal (useCallback để stable refs) ---------- */
  const handleOpenChangePassword = useCallback(
    () => setChangePasswordOpen(true),
    []
  );
  const handleCloseChangePassword = useCallback(
    () => setChangePasswordOpen(false),
    []
  );

  const openDeleteAccount = useCallback(() => {
    setDeleteMode("account");
    setDeleteOpen(true);
  }, []);

  const openLogoutConfirm = useCallback(() => {
    setDeleteMode("logout");
    setDeleteOpen(true);
  }, []);

  const closeDelete = useCallback(() => {
    setDeleteOpen(false);
    setDeleteMode(null);
  }, []);

  /* ---------- Xử lý khi xác nhận (thực thi action thực tế ở đây) ---------- */
  const handleDeleteConfirm = useCallback(() => {
    if (deleteMode === "logout") {
      // TODO: gọi hàm logout thật (clear token, redirect...)
      console.log("Đã xác nhận đăng xuất");
    } else if (deleteMode === "account") {
      // TODO: gọi API xóa tài khoản, show spinner / error handling
      console.log("Đã xác nhận xóa tài khoản");
    }
    // đóng modal sau khi xử lý
    closeDelete();
  }, [deleteMode, closeDelete]);

  return (
    <MainLayout auth={true} navbarBottom={true} title={PAGE_TITLE.vi}>
      <div className="flex gap-6 justify-center md:flex-row flex-col">
        {/* Left: profile card */}
        <Card className="flex flex-col gap-6 justify-center items-center px-8 py-6">
          <div className="w-[150px] h-[150px] rounded-full border border-[var(--secondary-blue-color)] shadow-lg">
            <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-50">
              {AvatarIcon}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">{HEADINGS.PROFILE}</h2>

            {/* Tên & vai trò */}
            <div className="flex items-center space-x-4 mt-4">
              {UserIcon}
              <div>
                <p className="font-medium">{USER_INFO.NAME}</p>
                <p className="text-sm text-gray-600">{USER_INFO.ROLE}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4 mt-4">
              {EmailIcon}
              <div>
                <p className="font-medium">{USER_INFO.EMAIL}</p>
                <p className="text-sm text-gray-600">{USER_INFO.EMAIL_LABEL}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: settings */}
        <Card className=" p-6">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold">
              {HEADINGS.SETTINGS_SECTION}
            </h2>

            <div className="space-y-4">
              {/* Đăng xuất */}
              <div className="flex items-center justify-between bg-white/5 rounded">
                <div className="flex items-center justify-between space-x-4">
                  {LogoutIcon}
                  <div>
                    <p className="font-medium">{TEXTS.LOGOUT_TITLE}</p>
                    <p className="text-sm text-gray-600">{TEXTS.LOGOUT_DESC}</p>
                  </div>
                </div>
                <Button variant="red" size="sm" onClick={openLogoutConfirm}>
                  {TEXTS.LOGOUT_TITLE}
                </Button>
              </div>

              {/* Đổi mật khẩu */}
              <div className="flex items-center justify-between gap-4 bg-white/5 rounded-md">
                <div className="flex items-center space-x-4">
                  {KeyIcon}
                  <div>
                    <p className="font-medium">{TEXTS.CHANGE_PASSWORD_TITLE}</p>
                    <p className="text-sm text-gray-600">
                      {TEXTS.CHANGE_PASSWORD_DESC}
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenChangePassword}
                >
                  {TEXTS.CHANGE_PASSWORD_TITLE}
                </Button>
              </div>

              {/* Xóa tài khoản */}
              <div className="flex items-center justify-between bg-white/5 rounded">
                <div className="flex items-center space-x-4">
                  {TrashIcon}
                  <div>
                    <p className="font-medium">{TEXTS.DELETE_ACCOUNT_TITLE}</p>
                    <p className="text-sm text-gray-600">
                      {TEXTS.DELETE_ACCOUNT_DESC}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openDeleteAccount}
                >
                  {TEXTS.BUTTON_DELETE}
                </Button>
              </div>
            </div>

            {/* UI settings: theme / language / currency */}
            <div className="border-t border-gray-200/10">
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="font-medium">{UI_SETTINGS.THEME.LABEL}</p>
                  <p className="text-sm text-gray-600">
                    {UI_SETTINGS.THEME.DESC}
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-12 h-6 bg-gray-300 rounded-full relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full"></div>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{UI_SETTINGS.LANGUAGE.LABEL}</p>
                  <p className="text-sm text-gray-600">
                    {UI_SETTINGS.LANGUAGE.DESC}
                  </p>
                </div>
                <select
                  defaultValue="vi"
                  className="bg-transparent border border-gray-300 rounded px-3 py-1"
                >
                  {UI_SETTINGS.LANGUAGE.OPTIONS.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{UI_SETTINGS.CURRENCY.LABEL}</p>
                  <p className="text-sm text-gray-600">
                    {UI_SETTINGS.CURRENCY.DESC}
                  </p>
                </div>
                <select
                  defaultValue="vnd"
                  className="bg-transparent border border-gray-300 rounded px-3 py-1"
                >
                  {UI_SETTINGS.CURRENCY.OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>
        {/* ------------Modal------------ */}
        {/* Modal for changing password */}
        <ChangePassword
          open={changePasswordOpen}
          onClose={handleCloseChangePassword}
        />
        {/* Modal for delete confirmation (for logout or delete account) */}
        <DeleteConfirm
          open={deleteOpen}
          onClose={closeDelete}
          title={
            deleteMode === "account"
              ? TEXTS.DELETE_ACCOUNT_TITLE
              : TEXTS.LOGOUT_TITLE
          }
          description={
            deleteMode === "account"
              ? TEXTS.DELETE_ACCOUNT_DESC
              : TEXTS.LOGOUT_DESC
          }
          confirmLabel={
            deleteMode === "account"
              ? TEXTS.DELETE_ACCOUNT_TITLE
              : TEXTS.LOGOUT_TITLE
          }
          confirmVariant={deleteMode === "account" ? "red" : "blue"}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </MainLayout>
  );
}
