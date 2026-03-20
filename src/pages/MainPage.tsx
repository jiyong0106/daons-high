/**
 * 메인(랜딩) 페이지
 * - 서비스 소개
 * - 퍼즐 시작 CTA 버튼
 * - 부적 느낌의 디자인
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../stores/gameStore";
import Layout from "../components/layout/Layout";

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

export default function MainPage() {
  const navigate = useNavigate();
  const initGame = useGameStore((s) => s.initGame);

  const handleStartPuzzle = async () => {
    await initGame();
    navigate("/puzzle");
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <FloatingEmojis />

        {/* 로고 및 타이틀 */}
        <motion.div
          className="text-center mb-10 relative z-10"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          {/* 부적 프레임 장식 */}
          <motion.div
            className="inline-block p-12 mb-4 relative"
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="absolute inset-0 border-2 border-[var(--color-primary)] rounded-2xl opacity-30 rotate-2" />
            <div className="absolute inset-0 border-2 border-[var(--color-accent)] rounded-2xl opacity-20 -rotate-2" />
            <span className="text-7xl md:text-8xl">🐱</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            다온스하이
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-[var(--text-secondary)] mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            daon's high
          </motion.p>

          <motion.p
            className="text-sm text-[var(--color-primary)] font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            퍼즐을 맞춰 액운을 막고 고양이 부적을 획득하세요!
          </motion.p>
        </motion.div>

        {/* CTA 버튼 */}
        <motion.div
          className="relative z-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          <motion.button
            onClick={handleStartPuzzle}
            className="
              px-10 py-4 
              bg-gradient-to-br from-[var(--color-primary)] to-[#A00000]
              text-white text-lg font-bold
              rounded-2xl shadow-xl
              cursor-pointer
              relative overflow-hidden
            "
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(200, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {/* 버튼 내부 광택 효과 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <span className="relative">🎴 퍼즐 맞추기</span>
          </motion.button>
        </motion.div>

        {/* 하단 안내 텍스트 */}
        <motion.div
          className="mt-12 text-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex flex-col gap-2 text-xs text-[var(--text-secondary)]">
            <p>🧩 3×3 슬라이딩 퍼즐로 고양이 사진을 맞추세요</p>
            <p>🐾 총 26마리의 귀여운 고양이가 기다리고 있어요</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
