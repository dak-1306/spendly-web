import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import { IMAGES } from "../assets/index.js";
import { useLanguage } from "../hooks/useLanguage";
import { useAuth } from "../hooks/useAuth.js";

import { motion } from "framer-motion";

export default function Home() {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();

  const images = useMemo(
    () => [
      IMAGES.dashboard_image,
      IMAGES.expense_image,
      IMAGES.AI_image,
      IMAGES.profile_image,
    ],
    [],
  );

  const { t } = useLanguage();
  const captions = useMemo(() => t("home.captions"), [t]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((s) => (s + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [images.length]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // animation config
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <MainLayout title={false}>
      <div className="grid grid-cols-2 gap-4">
        {/* Left */}
        <motion.div variants={item} initial="hidden" animate="show">
          <div className="h-full my-auto flex items-center justify-center">
            <div className="relative w-full p-2 overflow-hidden">
              <div
                className="flex h-full transition-transform duration-1000 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                style={{ transform: `translateX(-${active * 100}%)` }}
              >
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center space-y-2"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      className="object-cover rounded-2xl shadow-lg border-2 border-white"
                    />
                    <p className="text-sm">{captions[i]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          className="flex flex-col justify-center items-center p-8 space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h2
            variants={item}
            className="text-blue-600 dark:text-blue-400 text-3xl font-bold"
          >
            {t("home.welcomeMessage")}
          </motion.h2>

          <motion.p
            variants={item}
            className="text-lg text-orange-600 dark:text-orange-400"
          >
            {t("home.text")}
          </motion.p>

          <motion.div variants={item}>
            <Card className="flex flex-col items-start space-y-4 ">
              {t("home.description").map((desc, index) => (
                <p key={index} className="text-lg">
                  {desc}
                </p>
              ))}
            </Card>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <motion.div variants={item}>
              <Card>
                <h2 className="text-blue-600 dark:text-blue-400 text-xl font-semibold mb-2">
                  {t("home.featureHighlightsTitle")}
                </h2>
                <ul className="list-disc list-inside space-y-1">
                  {t("home.featureHighlights").map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card>
                <h2 className="text-orange-600 dark:text-orange-400 text-xl font-semibold mb-2">
                  {t("home.howItWorksTitle")}
                </h2>
                <ol className="list-decimal list-inside space-y-1">
                  {t("home.howItWorks").map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={item}>
            <Link to="/register">
              <Button variant="primary" size="lg">
                {t("home.textButton")}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
