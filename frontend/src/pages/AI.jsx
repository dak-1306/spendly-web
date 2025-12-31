import { useState } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import BorderLinearColor from "../components/ai/BorderLinearColor.jsx";
import Card from "../components/common/Card.jsx";
import Chat from "../components/ai/Chat.jsx";
import { ICONS } from "../assets/index.js";
function AI() {
  const [chatOpen, setChatOpen] = useState(false);
  const ROBOT_ICON = ICONS.icon_robot_color;

  const option = [
    "Tại sao chi tiêu của tôi lại tăng trong tháng này?",
    "Tôi có thể làm gì để giảm chi tiêu không cần thiết?",
    "Bạn có thể cung cấp cho tôi một số mẹo tiết kiệm tiền không?",
  ];
  return (
    <MainLayout auth={true} navbarBottom={true} title="Trợ lý AI - Spendly">
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
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-24 right-10 p-[1px] bg-linear-color rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
      >
        <div className="px-4 py-5 bg-white rounded-full">
          <img
            src={ROBOT_ICON.src}
            alt={ROBOT_ICON.alt}
            width={ROBOT_ICON.width}
            height={ROBOT_ICON.height}
          />
        </div>
      </button>

      <Chat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        option={option}
      />
    </MainLayout>
  );
}
export default AI;
