// src/utils/constants.js
import {
  User,
  Mail,
  Trash2,
  Image,
  Key,
  LogOut,
  Edit2,
  Search,
  DollarSign,
  CreditCard,
  Wallet,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Footer
export const FOOTER = {
  text: "© 2024 Spendly. All rights reserved.",
};

// Home
export const HOME = {
  welcomeMessage: "Manage your money. Smarter",
  text: "Track income, expenses, and budget in one place.",
  description: [
    "Monitor income and expenses with a clean, intuitive dashboard.",
    "Set monthly limits and get warned before overspending.",
    "Understand spending habits and receive smart financial suggestions.",
  ],
  featureHighlightsTitle: "Feature highlights",
  featureHighlights: [
    "Real-time expense tracking",
    "Customizable budget categories",
    "Detailed financial reports",
    "Secure data encryption",
    "Multi-device sync",
  ],
  howItWorksTitle: "How it works",
  howItWorks: [
    "Sign up for a free account",
    "Link your bank accounts",
    "Set your budget goals",
    "Start tracking your expenses",
    "Review reports and adjust as needed",
  ],
  textButton: "Get Started for Free",
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
  ICONS: {
    USER: User,
    EMAIL: Mail,
    AVATAR_EMPTY: Image,
    KEY: Key,
    LOGOUT: LogOut,
    TRASH: Trash2,
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
  ICONS: {
    TRASH: Trash2,
    EDIT: Edit2,
    SEARCH: Search,
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
  ICONS: {
    DOLLAR: DollarSign,
    CREDIT_CARD: CreditCard,
    WALLET: Wallet,
    ARROW_UP: ArrowUp,
    ARROW_DOWN: ArrowDown,
  },
};
