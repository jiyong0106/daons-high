import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../stores/gameStore";
import Layout from "../components/layout/Layout";
import NicknameModal from "../components/modals/NicknameModal";
import RankingModal from "../components/modals/RankingModal";
import daonGif from "../assets/images/redaon.gif"; // 경로에 맞춰 수정

// 떠다니는 고양이 이모지 배경 장식
function FloatingEmojis() {
  const emojis = ["🐱", "🐾", "✨", "🎴", "🧧", "😺", "🌟", "🐈"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {emojis.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl md:text-3xl opacity-20"
          style={{
            left: `${10 + ((i * 12) % 80)}%`,
            top: `${15 + ((i * 17) % 60)}%`,
          }}
          animate={{
            y: [0, -15, 0, 15, 0],
            x: [0, 8, 0, -8, 0],
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

// 타이핑 효과 텍스트 컴포넌트
function TypingText({ text }: { text: string }) {
  return (
    <motion.p
      className="text-xs text-center leading-relaxed text-[var(--text-secondary)] opacity-80 max-w-xs md:max-w-md"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.03, delayChildren: 0.5 } },
      }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}

export default function MainPage() {
  const navigate = useNavigate();
  const { userName, setUserName, initGame } = useGameStore();
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);

  const handleStartPuzzle = async () => {
    if (!userName) {
      setIsNicknameModalOpen(true);
      return;
    }
    await initGame();
    navigate("/puzzle");
  };

  const handleNicknameConfirm = async (nickname: string) => {
    setUserName(nickname);
    setIsNicknameModalOpen(false);
    // 닉네임 설정 후 바로 게임 시작
    await initGame();
    navigate("/puzzle");
  };

  const description =
    "다온스 하이(daon's High)는 다온이나 라온이를 30분 이상 보면 뇌에서 엔도르핀과 엔도카나비노이드가 분비되어 피로감 대신 극적인 행복감과 상쾌함을 느끼는 상태입니다. 1979년 아놀드 맨델이 제안한 개념으로, 팔다리가 가벼워지고 통증이 사라지며 도취감을 느끼게 됩니다";

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-start gap-5 px-2 py-15 relative">
        <FloatingEmojis />
        <TypingText text={description} />

        {/* 로고 및 타이틀 */}
        <motion.div
          className="text-center relative z-10"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          {/* 부적 프레임 장식 */}
          <motion.div
            className="inline-block p-5 md:p-20 mb-8 relative flex items-center justify-center"
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="absolute inset-0 border-2 border-[var(--color-primary)] rounded-3xl opacity-30 rotate-2"></div>
            <div className="absolute inset-0 border-2 border-[var(--color-accent)] rounded-3xl opacity-20 -rotate-2" />

            {/* 고양이 이모지 크기를 줄여서 박스 안에 쏙 들어가게 함 */}
            <span className="text-6xl md:text-7xl relative z-10 leading-none">
              🐱
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-[0.15em]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            다온스하이
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-[var(--text-secondary)] mb-4 tracking-[0.2em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            daon's high
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-[var(--color-primary)] font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            퍼즐을 맞춰 부적을 획득하세요!
          </motion.p>
        </motion.div>

        {/* 하단 안내 텍스트 */}
        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col gap-2 text-xs md:text-sm text-[var(--text-secondary)] opacity-80">
            <p>🧩 3×3 슬라이딩 퍼즐로 사진을 맞춰보세요</p>
            <p>🐾 총 26장의 귀여운 다온이, 라온이가 기다리고 있어요</p>
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
               bg-gradient-to-br from-[var(--color-primary)] to-[#A00000]
               text-white text-md  tracking-widest
               rounded-2xl shadow-2xl
               cursor-pointer
               relative overflow-hidden
            "
            animate={{
              y: [0, -10, 0], // 0에서 -10px만큼 올라갔다가 다시 0으로
            }}
            transition={{
              duration: 1, // 1.5초 동안 한 번의 사이클
              repeat: Infinity, // 무한 반복
              ease: "easeInOut", // 부드럽게 가속/감속
            }}
            /* --- 점핑 애니메이션 추가 끝 --- */

            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(200, 0, 0, 0.4)",
              /* 호버 시 점핑 멈추게 하고 싶다면 y: 0 추가 가능 */
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* 버튼 내부 광택 효과 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
        {/* 랭킹 확인 버튼 추가 */}
        {/* <motion.button
          onClick={() => setIsRankingModalOpen(true)}
          className="w-full mt-4 text-sm text-[var(--text-secondary)] font-medium underline underline-offset-4 opacity-70 cursor-pointer"
          whileHover={{ opacity: 1, scale: 1.05 }}
        >
          🏆 랭킹 확인하기
        </motion.button> */}
      </div>

      {/* 모달들 */}
      <NicknameModal
        isOpen={isNicknameModalOpen}
        onConfirm={handleNicknameConfirm}
      />
      <RankingModal
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
      />
    </Layout>
  );
}
