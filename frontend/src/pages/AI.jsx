import React, { useState, useMemo } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import BorderLinearColor from "../components/ai/BorderLinearColor.jsx";
import Card from "../components/common/Card.jsx";
import Chat from "../components/ai/Chat.jsx";
import { AI_CONSTANTS } from "../utils/constants.js";
import { ICONS } from "../assets/index.js";

/*
  AI.jsx
  - Trang trợ lý AI: hiển thị tổng quan + nút mở chat
  - Mục tiêu: sạch, dễ đọc, dùng constants và component ref từ utils/constants
  - Ghi chú: Robot icon là component (lucide), không dùng <img> từ assets
*/

export default function AI() {
  // trạng thái modal chat
  const [chatOpen, setChatOpen] = useState(false);

  const robotIcon = ICONS.icon_robot_color;

  // quick options từ constants
  const quickOptions = AI_CONSTANTS.QUICK_OPTIONS;

  return (
    <MainLayout
      auth={true}
      navbarBottom={true}
      title={AI_CONSTANTS.PAGE_TITLE.vi}
    >
      {/* Nội dung chính: các thẻ tổng quan */}
      <div className="space-y-6 mx-10">
        <Card>
          <BorderLinearColor
            title="Tổng quan chi tiêu"
            description={[
              "Trong tháng này, bạn đã chi tiêu tổng cộng 5.200.000 VND, tăng 12% so với tháng trước.",
              "Chi tiêu nhiều nhất vào các danh mục: Thực phẩm, Giải trí và Mua sắm.",
              "Bạn đã tiết kiệm được 800.000 VND so với ngân sách đặt ra.",
            ]}
          />
        </Card>

        <Card className="space-y-6">
          <BorderLinearColor
            title="Tăng chi tiêu"
            description={[
              "Chi tiêu của bạn trong tháng này đã tăng 18% so với tháng trước.",
              "Chi tiêu cho thực phẩm tăng nhiều nhất.",
              "Hãy cân nhắc đặt ngân sách cho việc ăn ngoài để tiết kiệm tiền.",
            ]}
          />
          <BorderLinearColor
            title="Rủi ro vượt ngân sách"
            description={[
              'Bạn có nguy cơ vượt ngân sách đã đặt cho "Mua sắm" trong tuần này nếu tiếp tục chi tiêu với tốc độ hiện tại.',
              "Hãy xem xét giảm bớt các khoản chi tiêu không cần thiết để duy trì ngân sách của bạn.",
            ]}
          />
          <BorderLinearColor
            title="Lời khuyên"
            description={[
              "Để giảm chi tiêu không cần thiết, hãy thử theo dõi các khoản chi hàng ngày của bạn.",
              "Lên kế hoạch bữa ăn trước và tạo danh sách mua sắm để tránh mua sắm theo cảm hứng.",
            ]}
          />
        </Card>
      </div>

      {/* Nút mở chat: dùng RobotIcon component, có aria-label cho accessibility */}
      <button
        onClick={() => setChatOpen(true)}
        aria-label="Mở chat trợ lý AI"
        className="fixed bottom-24 right-10 p-[1px] bg-linear-color rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
      >
        <div className="px-4 py-5 bg-white rounded-full">
          <img src={robotIcon.src} alt={robotIcon.alt} />
        </div>
      </button>

      {/* Chat modal */}
      <Chat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        option={quickOptions}
      />
    </MainLayout>
  );
}
