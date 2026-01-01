import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { ICONS } from "../assets/index.js";
function Setting() {
  const USER_ICON = ICONS.icon_user;
  const EMAIL_ICON = ICONS.icon_email;
  const TRASH_ICON = ICONS.icon_trash;
  const AVATAR_EMPTY_ICON = ICONS.icon_avatar_empty;
  const KEY_ICON = ICONS.icon_key;
  const LOGOUT_ICON = ICONS.icon_out;
  return (
    <MainLayout auth={true} navbarBottom={true} title="Settings và Profile">
      <div className="flex gap-6 justify-center md:flex-row flex-col">
        <Card className="flex flex-col gap-6 justify-center items-center px-8 py-6">
          <div className="w-[150px] h-[150px] rounded-full border border-[var(--secondary-blue-color)] shadow-lg">
            <img
              src={AVATAR_EMPTY_ICON.src}
              alt={AVATAR_EMPTY_ICON.alt}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
            <div className="flex items-center space-x-4 mt-4">
              <img
                src={USER_ICON.src}
                alt={USER_ICON.alt}
                width={USER_ICON.width}
                height={USER_ICON.height}
              />
              <div>
                <p className="font-medium">Nguyễn Văn A</p>
                <p className="text-sm text-gray-600">Người dùng Spendly</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <img
                src={EMAIL_ICON.src}
                alt={EMAIL_ICON.alt}
                width={EMAIL_ICON.width}
                height={EMAIL_ICON.height}
              />
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
                  <img
                    src={LOGOUT_ICON.src}
                    alt={LOGOUT_ICON.alt}
                    width={LOGOUT_ICON.width}
                    height={LOGOUT_ICON.height}
                  />
                  <div>
                    <p className="font-medium">Đăng xuất</p>
                    <p className="text-sm text-gray-600">
                      Đăng xuất khỏi tài khoản hiện tại
                    </p>
                  </div>
                </div>
                <Button variant="red" size="sm">
                  Đăng xuất
                </Button>
              </div>

              <div className="flex items-center justify-between gap-4 bg-white/5 rounded-md">
                <div className="flex items-center space-x-4">
                  <img
                    src={KEY_ICON.src}
                    alt={KEY_ICON.alt}
                    width={KEY_ICON.width}
                    height={KEY_ICON.height}
                  />
                  <div>
                    <p className="font-medium">Đổi mật khẩu</p>
                    <p className="text-sm text-gray-600">
                      Thay đổi mật khẩu đăng nhập
                    </p>
                  </div>
                </div>
                <Button variant="primary" size="sm">
                  Đổi mật khẩu
                </Button>
              </div>

              <div className="flex items-center justify-between bg-white/5 rounded">
                <div className="flex items-center space-x-4">
                  <img
                    src={TRASH_ICON.src}
                    alt={TRASH_ICON.alt}
                    width={TRASH_ICON.width}
                    height={TRASH_ICON.height}
                    className="text-red-600"
                  />
                  <div>
                    <p className="font-medium">Xóa tài khoản</p>
                    <p className="text-sm text-gray-600">
                      Xóa vĩnh viễn dữ liệu tài khoản
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
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
      </div>
    </MainLayout>
  );
}
export default Setting;
