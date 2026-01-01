import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "../assets/index.js";
import { HOME } from "../utils/constants.js";
function Home() {
  const navigate = useNavigate();
  const { dashboard_image, expense_image, AI_image, profile_image } = IMAGES;
  const images = [dashboard_image, expense_image, AI_image, profile_image];

  // short descriptions shown at the bottom of each image inside the card
  const captions = [
    "Dashboard — tổng quan thu chi, biểu đồ và số liệu quan trọng.",
    "Expenses — quản lý chi tiêu, danh mục và lịch sử giao dịch.",
    "AI Insights — đề xuất thông minh và phân tích tự động.",
    "Profile — cấu hình người dùng và thiết lập cá nhân.",
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((s) => (s + 1) % images.length);
    }, 5000); // chuyển mỗi 5 giây
    return () => clearInterval(id);
  }, []);

  return (
    <MainLayout title={false}>
      <div className="grid grid-cols-2 gap-4">
        <Card className="m-8 flex items-center justify-center">
          <div className="relative w-full h-[450px] p-2 overflow-hidden">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
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
                  <div className="absolute left-1/2 -translate-x-1/2 mt-4 bottom-0 w-[76%] bg-white bg-opacity-90 text-center rounded-md px-4 py-2 shadow-md">
                    <p className="text-sm text-body">{captions[i]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <div className="flex flex-col justify-center items-center p-8 space-y-6">
          <h1 className="text-h1 text-3xl font-bold">{HOME.welcomeMessage}</h1>
          <p className="text-body">{HOME.text}</p>
          <Card className="flex flex-col items-start space-y-4">
            {HOME.description.map((desc, index) => (
              <p key={index} className="text-center text-lg text-body">
                {desc}
              </p>
            ))}
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <h2 className="text-[var(--primary-blue-color)] text-xl font-semibold mb-2">
                {HOME.featureHighlightsTitle}
              </h2>
              <ul className="list-disc list-inside text-body space-y-1">
                {HOME.featureHighlights.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="text-[var(--primary-green-color)] text-xl font-semibold mb-2">
                {HOME.howItWorksTitle}
              </h2>
              <ol className="list-decimal list-inside text-body space-y-1">
                {HOME.howItWorks.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </Card>
          </div>
          <Button
            variant="gradient"
            size="lg"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            {HOME.textButton}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
export default Home;
