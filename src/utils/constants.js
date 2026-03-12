// src/utils/constants.js

// Footer
export const FOOTER = {
  text: "Spendly - Quản lý chi tiêu thông minh",
};

// Home
export const HOME = {
  welcomeMessage: "Chào mừng đến với Spendly!",
  text: "Quản lý chi tiêu của bạn một cách thông minh và dễ dàng.",
  description: [
    "Theo dõi chi tiêu hàng ngày và xem báo cáo chi tiết.",
    "Chỉnh sửa và xóa các giao dịch một cách dễ dàng.",
    "Hiểu rõ thói quen chi tiêu và nhận được những gợi ý tài chính thông minh.",
  ],
  featureHighlightsTitle: "Tính năng nổi bật",
  featureHighlights: [
    "Theo dõi chi tiêu thời gian thực",
    "Danh mục ngân sách có thể tùy chỉnh",
    "Báo cáo tài chính chi tiết",
    "Mã hóa dữ liệu an toàn",
    "Đồng bộ đa thiết bị",
  ],
  howItWorksTitle: "Cách hoạt động",
  howItWorks: [
    "Đăng ký tài khoản miễn phí",
    "Liên kết tài khoản ngân hàng",
    "Đặt mục tiêu ngân sách",
    "Bắt đầu theo dõi chi tiêu",
    "Xem báo cáo và điều chỉnh khi cần thiết",
  ],
  textButton: "Bắt đầu ngay",
};

// Settings page constants (clear, reusable names)
export const SETTINGS = {
  PAGE_TITLE: {
    vi: "Cài đặt tài khoản",
    en: "Account Settings",
  },

  HEADINGS: {
    PROFILE: "Thông tin cá nhân",
    SETTINGS_SECTION: "Cài đặt tài khoản",
  },

  USER_INFO: {
    NAME: "Nguyễn Văn A",
    ROLE: "Người dùng Spendly",
    EMAIL: "email@example.com",
    EMAIL_LABEL: "Email liên hệ",
  },

  UI_SETTINGS: {
    THEME: {
      LABEL: "Giao diện",
      DESC: "Chuyển giữa sáng và tối",
      OPTIONS: [
        { label: "Sáng", value: "light" },
        { label: "Tối", value: "dark" },
      ],
    },
    LANGUAGE: {
      LABEL: "Ngôn ngữ",
      DESC: "Chọn ngôn ngữ hiển thị",
      OPTIONS: [
        { label: "Tiếng Việt", value: "vi" },
        { label: "English", value: "en" },
      ],
    },
    CURRENCY: {
      LABEL: "Đơn vị tiền tệ",
      DESC: "Chọn định dạng tiền tệ",
      OPTIONS: [
        { label: "VND (₫)", value: "vnd" },
        { label: "USD ($)", value: "usd" },
        { label: "EUR (€)", value: "eur" },
      ],
    },
  },

  TEXTS: {
    LOGOUT_TITLE: "Đăng xuất",
    LOGOUT_DESC: "Đăng xuất khỏi tài khoản hiện tại",
    CHANGE_PASSWORD_TITLE: "Đổi mật khẩu",
    CHANGE_PASSWORD_DESC: "Thay đổi mật khẩu đăng nhập",
    DELETE_ACCOUNT_TITLE: "Xóa tài khoản",
    DELETE_ACCOUNT_DESC: "Xóa vĩnh viễn dữ liệu tài khoản",
    BUTTON_DELETE: "Xóa",
  },
};

// Expense page constants
export const EXPENSE = {
  PAGE_TITLE: {
    vi: "Quản lý chi tiêu và thu nhập",
    en: "Expenses & Income",
  },
  DEFAULT_MONTH: "2025-07",
  CATEGORIES: [
    "Nhà thuê",
    "Ăn uống",
    "Siêu thị",
    "Di chuyển",
    "Giải trí",
    "Tiện ích",
    "Khác",
  ],
  AMOUNT_RANGES: [
    { id: "lt100", label: "< 100,000", min: 0, max: 100000 },
    { id: "100-500", label: "100,000 - 500,000", min: 100000, max: 500000 },
    { id: "500-1M", label: "500,000 - 1,000,000", min: 500000, max: 1000000 },
    { id: "gt1M", label: "> 1,000,000", min: 1000000, max: Infinity },
  ],
  BUTTONS: {
    ADD_EXPENSE: "Thêm chi tiêu",
    ADD_INCOME: "Thêm thu nhập",
    EDIT: "Sửa",
    DELETE: "Xóa",
  },
};

// AI page constants
export const AI_CONSTANTS = {
  PAGE_TITLE: {
    vi: "Trợ lý AI - Spendly",
    en: "AI Assistant - Spendly",
  },
  QUICK_OPTIONS: [
    "Tại sao chi tiêu của tôi lại tăng trong tháng này?",
    "Tôi có thể làm gì để giảm chi tiêu không cần thiết?",
    "Bạn có thể cung cấp cho tôi một số mẹo tiết kiệm tiền không?",
  ],
};

// Dashboard page constants
export const DASHBOARD = {
  DEFAULT_MONTH: "2025-12",
  PAGE_TITLE: {
    vi: "Tổng quan",
    en: "Dashboard",
  },
  CARD_TITLES: {
    INCOME: "Tổng thu nhập",
    EXPENSES: "Tổng chi tiêu",
    BALANCE: "Số dư hiện tại",
    COMPARE: "Chi tiêu so với tháng trước",
  },
  CHART_TITLES: {
    EXPENSES_BY_CATEGORY: "Chi tiêu theo danh mục",
    INCOME_VS_EXPENSES: "Thu nhập vs Chi tiêu",
    EXPENSES_OVER_TIME: "Chi tiêu theo ngày",
  },
};
