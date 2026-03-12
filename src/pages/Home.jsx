import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import { IMAGES } from "../assets/index.js";
import { HOME } from "../utils/constants.js";
import { useAuth } from "../hooks/useAuth.js";

/*
  Home.jsx
  - Trang landing / giới thiệu các khu vực chính của app
*/

export default function Home() {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  // Images lấy từ asset map (memo để tránh recreate khi render lại)
  const images = useMemo(
    () => [
      IMAGES.dashboard_image,
      IMAGES.expense_image,
      IMAGES.AI_image,
      IMAGES.profile_image,
    ],
    [],
  );

  // Mô tả ngắn bên dưới mỗi ảnh
  const captions = useMemo(
    () => [
      "Dashboard — tổng quan thu chi, biểu đồ và số liệu quan trọng.",
      "Expenses — quản lý chi tiêu, danh mục và lịch sử giao dịch.",
      "AI Insights — đề xuất thông minh và phân tích tự động.",
      "Profile — cấu hình người dùng và thiết lập cá nhân.",
    ],
    [],
  );

  // Slider index hiện tại
  const [active, setActive] = useState(0);

  // Tự động chuyển ảnh: setInterval + cleanup
  useEffect(() => {
    const id = setInterval(() => {
      setActive((s) => (s + 1) % images.length);
    }, 5000); // chuyển mỗi 5s
    return () => clearInterval(id);
  }, [images.length]);

  // Kiểm tra auth khi vào trang (nếu đã login thì redirect Dashboard)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      // Nếu đã login, redirect ngay
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <MainLayout title={false}>
      <div className="grid grid-cols-2 gap-4">
        {/* Left: slider ảnh giới thiệu */}
        <Card className="h-[450px] my-auto flex items-center justify-center">
          <div className="relative w-full p-2 overflow-hidden">
            {/* wrapper chuyển translateX dựa trên active */}
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
              aria-live="polite"
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full h-full flex items-center justify-center relative"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    className="object-cover rounded-2xl shadow-lg border-2 border-white"
                  />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[76%] bg-white bg-opacity-90 text-center rounded-md px-4 py-2 shadow-md">
                    <p className="text-sm text-body">{captions[i]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Right: giới thiệu, tính năng và CTA */}
        <div className="flex flex-col justify-center items-center p-8 space-y-4">
          <h1 className="text-blue-600 text-3xl font-bold">
            {HOME.welcomeMessage}
          </h1>
          <p className="text-lg text-orange-600">{HOME.text}</p>

          <Card
            className="flex flex-col items-start space-y-4"
            animation={true}
          >
            {HOME.description.map((desc, index) => (
              <p key={index} className="text-gray-700 text-lg">
                {desc}
              </p>
            ))}
          </Card>

          <div className="grid grid-cols-2 gap-4 w-full">
            <Card animation={true}>
              <h2 className="text-blue-600 text-xl font-semibold mb-2">
                {HOME.featureHighlightsTitle}
              </h2>
              <ul className="list-disc list-inside text-body space-y-1">
                {HOME.featureHighlights.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </Card>

            <Card animation={true}>
              <h2 className="text-orange-600 text-xl font-semibold mb-2">
                {HOME.howItWorksTitle}
              </h2>
              <ol className="list-decimal list-inside text-body space-y-1">
                {HOME.howItWorks.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </Card>
          </div>

          <Link to="/register">
            <Button variant="primary" size="lg">
              {HOME.textButton}
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
