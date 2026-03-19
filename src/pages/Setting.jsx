import { useState, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ChangePassword from "../components/setting/ChangePassword";
import DeleteConfirm from "../components/common/DeleteConfirm";
import Avatar from "../components/setting/Avatar"; // <-- added
import { SETTINGS } from "../utils/constants";
import { useAuth } from "../hooks/useAuth"; // <-- giữ để dùng logout
import { useTheme } from "../hooks/useTheme"; // <-- thêm useTheme
import useUser from "../hooks/useUser"; // <-- thêm useUser
import { useNavigate } from "react-router-dom";
import { User, Mail, Key, Trash2, LogOut } from "lucide-react"; // <-- icons

/*
  Setting.jsx
  - Uses auth context: user, loading, logout, refresh
*/

export default function Setting() {
  const { PAGE_TITLE, HEADINGS, USER_INFO, UI_SETTINGS, TEXTS } = SETTINGS;

  const UserIcon = <User className="text-blue-500" size={24} />;
  const EmailIcon = <Mail className="text-green-500" size={24} />;
  const KeyIcon = <Key className="text-green-500" size={24} />;
  const TrashIcon = <Trash2 className="text-red-500" size={24} />;
  const LogoutIcon = <LogOut className="text-blue-500" size={24} />;

  const { loading, logout, deleteUserContext } = useAuth(); // auth context (for logout)
  const { theme, toggleTheme } = useTheme(); // theme context
  const { userDoc, refresh: refreshUser, deleteUserDocContext } = useUser(); // user context
  const navigate = useNavigate();

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null); // "account" | "logout" | null

  const handleOpenChangePassword = useCallback(
    () => setChangePasswordOpen(true),
    [],
  );
  const handleCloseChangePassword = useCallback(
    () => setChangePasswordOpen(false),
    [],
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

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteMode === "logout") {
      await logout();
      navigate("/login", { replace: true });
    } else if (deleteMode === "account") {
      await deleteUserDocContext(userDoc?.id);
      await deleteUserContext();
      navigate("/login", { replace: true });
    }
    closeDelete();
  }, [
    deleteMode,
    closeDelete,
    logout,
    navigate,
    deleteUserDocContext,
    deleteUserContext,
    userDoc?.id,
  ]);

  const displayName = userDoc?.name || USER_INFO.NAME;
  const email = userDoc?.email || USER_INFO.EMAIL;
  const photoURL = userDoc?.avatar || null;

  console.log("userDoc:", userDoc);

  return (
    <MainLayout auth={true} navbarBottom={true} title={PAGE_TITLE.vi}>
      <div className="flex gap-6 justify-center md:flex-row flex-col">
        {/* Left: profile card */}
        <Card className="flex flex-col gap-6 justify-center items-center px-8 py-6">
          <div className="rounded-full border border-gray-300 shadow-lg">
            <Avatar name={displayName} photoURL={photoURL} size={150} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">{HEADINGS.PROFILE}</h2>

            {/* Tên & vai trò */}
            <div className="flex items-center space-x-4 mt-4">
              {UserIcon}
              <div>
                <p className="font-medium">{displayName}</p>
                <p className="text-sm ">{USER_INFO.ROLE}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4 mt-4">
              {EmailIcon}
              <div>
                <p className="font-medium">{email}</p>
                <p className="text-sm">{USER_INFO.EMAIL_LABEL}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => refreshUser()}
                disabled={loading}
              >
                Làm mới
              </Button>
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
              <div className="flex items-center justify-between rounded">
                <div className="flex items-center justify-between space-x-4">
                  {LogoutIcon}
                  <div>
                    <p className="font-medium">{TEXTS.LOGOUT_TITLE}</p>
                    <p className="text-sm">{TEXTS.LOGOUT_DESC}</p>
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={openLogoutConfirm}
                  disabled={loading}
                >
                  {TEXTS.LOGOUT_TITLE}
                </Button>
              </div>

              {/* Đổi mật khẩu */}
              <div className="flex items-center justify-between gap-4 rounded-md">
                <div className="flex items-center space-x-4">
                  {KeyIcon}
                  <div>
                    <p className="font-medium">{TEXTS.CHANGE_PASSWORD_TITLE}</p>
                    <p className="text-sm">{TEXTS.CHANGE_PASSWORD_DESC}</p>
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
              <div className="flex items-center justify-between  rounded">
                <div className="flex items-center space-x-4">
                  {TrashIcon}
                  <div>
                    <p className="font-medium">{TEXTS.DELETE_ACCOUNT_TITLE}</p>
                    <p className="text-sm">{TEXTS.DELETE_ACCOUNT_DESC}</p>
                  </div>
                </div>
                <Button variant="danger" size="sm" onClick={openDeleteAccount}>
                  {TEXTS.BUTTON_DELETE}
                </Button>
              </div>
            </div>

            {/* UI settings: theme / language / currency */}
            <div className="border-t border-gray-300 dark:border-gray-600 mt-4 pt-4 space-y-4">
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="font-medium">{UI_SETTINGS.THEME.LABEL}</p>
                  <p className="text-sm">{UI_SETTINGS.THEME.DESC}</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                  />
                  {theme === "dark" ? (
                    <span className="w-10 h-5 bg-gray-600 rounded-full relative">
                      <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform transform translate-x-5" />
                    </span>
                  ) : (
                    <span className="w-10 h-5 bg-gray-300 rounded-full relative">
                      <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform transform" />
                    </span>
                  )}
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{UI_SETTINGS.LANGUAGE.LABEL}</p>
                  <p className="text-sm ">{UI_SETTINGS.LANGUAGE.DESC}</p>
                </div>
                <select
                  defaultValue="vi"
                  className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-3 py-1"
                >
                  {UI_SETTINGS.LANGUAGE.OPTIONS.map((lang) => (
                    <option
                      className="dark:bg-gray-800"
                      key={lang.value}
                      value={lang.value}
                    >
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{UI_SETTINGS.CURRENCY.LABEL}</p>
                  <p className="text-sm">{UI_SETTINGS.CURRENCY.DESC}</p>
                </div>
                <select
                  defaultValue="vnd"
                  className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-3 py-1"
                >
                  {UI_SETTINGS.CURRENCY.OPTIONS.map((c) => (
                    <option
                      className="dark:bg-gray-800"
                      key={c.value}
                      value={c.value}
                    >
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>
        {/* ------------Modal------------ */}
        <ChangePassword
          open={changePasswordOpen}
          onClose={handleCloseChangePassword}
        />
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
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </MainLayout>
  );
}
