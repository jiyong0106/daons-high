import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import Layout from "../components/layout/Layout";
import NicknameModal from "../components/modals/NicknameModal";
import RankingModal from "../components/modals/RankingModal";
import InstallGuideModal from "../components/modals/InstallGuideModal";
import FloatingEmojis from "../components/main/FloatingEmojis";
import TypingText from "../components/main/TypingText";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { MAIN_MESSAGES } from "../constants/messages";
import daonGif from "../assets/images/redaon.gif";

/**
 * 앱의 진입점인 메인 페이지 컴포넌트
 */
const MainPage = () => {
  const navigate = useNavigate();
  const { userName, setUserName, initGame } = useGameStore();
  const { isInstallable, isStandalone, isIOS, handleInstall } = usePWAInstall();
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);

  const handleStartPuzzle = async () => {
    if (!userName) {
      setIsNicknameModalOpen(true);
      return;
    }
    await initGame();
    navigate("/puzzle");
  };

  const onInstallClick = () => {
    if (isInstallable) {
      handleInstall();
    } else if (isIOS) {
      setIsInstallGuideOpen(true);
    }
  };

  const handleNicknameConfirm = async (nickname: string) => {
    setUserName(nickname);
    setIsNicknameModalOpen(false);
    // 닉네임 설정 후 바로 게임 시작
    await initGame();
    navigate("/puzzle");
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-start gap-5 px-2 py-6 relative">
        <FloatingEmojis />
        <TypingText text={MAIN_MESSAGES.DESCRIPTION} />

        {/* 로고 및 타이틀 */}
        <motion.div
          className="text-center relative z-10"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          {/* 부적 프레임 장식 */}
          <motion.div
            className="p-5 md:p-20 mb-8 relative flex items-center justify-center"
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="absolute inset-0 border-2 border-(--color-primary) rounded-3xl opacity-30 rotate-2"></div>
            <div className="absolute inset-0 border-2 border-(--color-accent) rounded-3xl opacity-20 -rotate-2" />

            <span className="text-6xl md:text-7xl relative z-10 leading-none">
              🐱
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-(--text-primary) tracking-[0.15em]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {MAIN_MESSAGES.TITLE}
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-(--text-secondary) mb-4 tracking-[0.2em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {MAIN_MESSAGES.SUBTITLE}
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-(--color-primary) font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {MAIN_MESSAGES.CTA_GUIDE}
          </motion.p>
        </motion.div>

        {/* 하단 안내 텍스트 */}
        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col gap-2 text-xs md:text-sm text-(--text-secondary) opacity-80">
            <p>{MAIN_MESSAGES.PUZZLE_GUIDE}</p>
            <p>{MAIN_MESSAGES.TOTAL_PICS}</p>
          </div>
        </motion.div>

        {/* CTA 버튼 */}
        <motion.div
          className="z-10 relative"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          <motion.button
            onClick={handleStartPuzzle}
            className="
               px-12 py-3 
               bg-linear-to-br from-(--color-primary) to-[#A00000]
               text-white text-md  tracking-widest
               rounded-2xl shadow-2xl
               cursor-pointer
               relative overflow-hidden
            "
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(200, 0, 0, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <span className="relative">시작하기</span>
          </motion.button>

          <motion.img
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, type: "spring" }}
            src={daonGif}
            alt="메인 로고"
            className="w-40 h-40 md:w-48 md:h-48 object-contain  absolute bottom-[-70px] right-[-110px] pointer-events-none"
          />
        </motion.div>
        <div>
          <motion.button
            onClick={() => setIsRankingModalOpen(true)}
            className="w-full mt-4 text-sm text-(--text-secondary) font-medium underline underline-offset-4 opacity-70 cursor-pointer"
            whileHover={{ opacity: 1, scale: 1.05 }}
          >
            🏆 명예의 전당
          </motion.button>

          {!isStandalone && (isInstallable || isIOS) && (
            <motion.button
              onClick={onInstallClick}
              className="w-full mt-3 text-xs text-(--text-secondary) font-medium underline underline-offset-4 opacity-70 cursor-pointer"
              whileHover={{ opacity: 1, scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
            >
              모바일 설치 방법 확인하기
            </motion.button>
          )}
        </div>
      </div>

      <NicknameModal
        isOpen={isNicknameModalOpen}
        onConfirm={handleNicknameConfirm}
      />
      {isRankingModalOpen && (
        <RankingModal
          isOpen={isRankingModalOpen}
          onClose={() => setIsRankingModalOpen(false)}
        />
      )}
      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />
    </Layout>
  );
};

export default MainPage;
