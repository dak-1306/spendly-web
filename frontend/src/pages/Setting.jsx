import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ChangePassword from "../components/setting/ChangePassword";
import DeleteConfirm from "../components/common/DeleteConfirm";
import { useState } from "react";
import { User, Mail, Trash2, Image, Key, LogOut } from "lucide-react";

export default function Setting() {
  const USER_ICON = (
    <User className="w-6 h-6 text-[var(--primary-blue-color)]" />
  );
  const EMAIL_ICON = (
    <Mail className="w-6 h-6 text-[var(--primary-green-color)]" />
  );
  const TRASH_ICON = <Trash2 className="w-6 h-6 text-[var(--red-color)]" />;
  const AVATAR_EMPTY_ICON = (
    <Image className="w-24 h-24 text-[var(--primary-blue-color)]" />
  );
  const KEY_ICON = (
    <Key className="w-6 h-6 text-[var(--primary-green-color)]" />
  );
  const LOGOUT_ICON = (
    <LogOut className="w-6 h-6 text-[var(--primary-blue-color)]" />
  );
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null); // "account" | "logout" | null

  const handleOpenChangePassword = () => setChangePasswordOpen(true);
  const handleCloseChangePassword = () => setChangePasswordOpen(false);

  const openDeleteAccount = () => {
    setDeleteMode("account");
    setDeleteOpen(true);
  };
  const openLogoutConfirm = () => {
    setDeleteMode("logout");
    setDeleteOpen(true);
  };
  const closeDelete = () => {
    setDeleteOpen(false);
    setDeleteMode(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteMode === "logout") {
      // thực hiện logout (thay bằng logic thực tế)
      console.log("Đã xác nhận đăng xuất");
    } else if (deleteMode === "account") {
      // thực hiện xóa tài khoản (thay bằng API call)
      console.log("Đã xác nhận xóa tài khoản");
    }
  };

  return (
    <MainLayout auth={true} navbarBottom={true} title="Settings và Profile">
      <div className="flex gap-6 justify-center md:flex-row flex-col">
        <Card className="flex flex-col gap-6 justify-center items-center px-8 py-6">
          <div className="w-[150px] h-[150px] rounded-full border border-[var(--secondary-blue-color)] shadow-lg">
            <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-50">
              {AVATAR_EMPTY_ICON}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
            <div className="flex items-center space-x-4 mt-4">
              {USER_ICON}
              <div>
                <p className="font-medium">Nguyễn Văn A</p>
                <p className="text-sm text-gray-600">Người dùng Spendly</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              {EMAIL_ICON}
              <div>
                <p className="font-medium">email@example.com</p>
                <p className="text-sm text-gray-600">Email liên hệ</p>
              </div>
            </div>
          </div>
        </Card>
        <Card className=" p-6">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold">Cài đặt tài khoản</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/5 rounded">
                <div className="flex items-center justify-between space-x-4">
                  {LOGOUT_ICON}
                  <div>
                    <p className="font-medium">Đăng xuất</p>
                    <p className="text-sm text-gray-600">
                      Đăng xuất khỏi tài khoản hiện tại
                    </p>
                  </div>
                </div>
                <Button variant="red" size="sm" onClick={openLogoutConfirm}>
                  Đăng xuất
                </Button>
              </div>

              <div className="flex items-center justify-between gap-4 bg-white/5 rounded-md">
                <div className="flex items-center space-x-4">
                  {KEY_ICON}
                  <div>
                    <p className="font-medium">Đổi mật khẩu</p>
                    <p className="text-sm text-gray-600">
                      Thay đổi mật khẩu đăng nhập
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenChangePassword}
                >
                  Đổi mật khẩu
                </Button>
              </div>

              <div className="flex items-center justify-between bg-white/5 rounded">
                <div className="flex items-center space-x-4">
                  {TRASH_ICON}
                  <div>
                    <p className="font-medium">Xóa tài khoản</p>
                    <p className="text-sm text-gray-600">
                      Xóa vĩnh viễn dữ liệu tài khoản
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openDeleteAccount}
                >
                  Xóa
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200/10">
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="font-medium">Giao diện</p>
                  <p className="text-sm text-gray-600">
                    Chuyển giữa sáng và tối
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-12 h-6 bg-gray-300 rounded-full relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full"></div>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Ngôn ngữ</p>
                  <p className="text-sm text-gray-600">
                    Chọn ngôn ngữ hiển thị
                  </p>
                </div>
                <select
                  defaultValue="vi"
                  className="bg-transparent border border-gray-300 rounded px-3 py-1"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Đơn vị tiền tệ</p>
                  <p className="text-sm text-gray-600">
                    Chọn định dạng tiền tệ
                  </p>
                </div>
                <select
                  defaultValue="vnd"
                  className="bg-transparent border border-gray-300 rounded px-3 py-1"
                >
                  <option value="vnd">VND (₫)</option>
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
        <ChangePassword
          open={changePasswordOpen}
          onClose={handleCloseChangePassword}
        />

        <DeleteConfirm
          open={deleteOpen}
          onClose={closeDelete}
          title={deleteMode === "account" ? "Xóa tài khoản" : "Đăng xuất"}
          description={
            deleteMode === "account"
              ? "Xóa tài khoản sẽ xóa vĩnh viễn dữ liệu của bạn. Bạn có chắc?"
              : "Bạn sẽ đăng xuất khỏi phiên hiện tại. Tiếp tục?"
          }
          confirmLabel={
            deleteMode === "account" ? "Xóa tài khoản" : "Đăng xuất"
          }
          confirmVariant={deleteMode === "account" ? "red" : "blue"}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </MainLayout>
  );
}
