import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGameStore } from "../stores/gameStore";
import { formatTime } from "../hooks/useTimer";
import Layout from "../components/layout/Layout";

export default function ResultPage() {
  const navigate = useNavigate();
  const gameStatus = useGameStore((s) => s.gameStatus);
  const selectedImage = useGameStore((s) => s.selectedImage);
  const moveCount = useGameStore((s) => s.moveCount);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const resetGame = useGameStore((s) => s.resetGame);
  const initGame = useGameStore((s) => s.initGame);
  const catName = useGameStore((s) => s.catName);

  // 게임 완료 상태가 아니면 메인으로
  useEffect(() => {
    if (gameStatus !== "completed") {
      navigate("/", { replace: true });
    }
  }, [gameStatus, navigate]);

  // 이미지 저장 기능
  const handleSaveImage = async () => {
    if (!selectedImage) return;

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `daons-high-cat-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      console.error("이미지 저장 실패");
    }
  };

  // 공유 기능 (Web Share API)
  const handleShare = async () => {
    if (!navigator.share || !selectedImage) return;

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], "daons-high-cat.png", {
        type: "image/png",
      });

      await navigator.share({
        title: "다온스하이 - 퍼즐 완성!",
        text: `🐱 고양이 퍼즐을 ${formatTime(elapsedTime)}에 ${moveCount}회 이동으로 맞췄어요!`,
        files: [file],
      });
    } catch {
      // 사용자가 공유를 취소한 경우
    }
  };

  // 다시 하기
  const handlePlayAgain = async () => {
    await initGame();
    navigate("/puzzle");
  };

  // 홈으로
  const handleGoHome = () => {
    resetGame();
    navigate("/");
  };

  if (gameStatus !== "completed") return null;

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
        {/* 헤더 */}
        <motion.div
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            🎉 축하합니다!
          </h1>
          <p className="text-[var(--text-secondary)]">
            멋진 {catName}이를 완성했어요!
          </p>
        </motion.div>

        {/* 완성된 이미지 */}
        {selectedImage && (
          <motion.div
            className="relative"
            initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            {/* 부적 느낌의 프레임 */}
            <div className="absolute -inset-3 border-2 border-[var(--color-primary)] rounded-3xl opacity-30 rotate-1" />
            <div className="absolute -inset-3 border-2 border-[var(--color-accent)] rounded-3xl opacity-20 -rotate-1" />

            <img
              src={selectedImage}
              alt="완성된 고양이"
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}

        {/* 기록 카드 */}
        <motion.div
          className="flex gap-6 bg-[var(--bg-surface)] px-8 py-4 rounded-2xl shadow-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <p className="text-xs text-[var(--text-secondary)] mb-1">
              ⏱ 소요 시간
            </p>
            <p className="text-2xl font-bold text-[var(--color-primary)] tabular-nums">
              {formatTime(elapsedTime)}
            </p>
          </div>
          <div className="w-px bg-[var(--border-color)]" />
          <div className="text-center">
            <p className="text-xs text-[var(--text-secondary)] mb-1">
              👆 이동 횟수
            </p>
            <p className="text-2xl font-bold text-[var(--color-primary)] tabular-nums">
              {moveCount}회
            </p>
          </div>
        </motion.div>

        {/* 액션 버튼들 */}
        <motion.div
          className="flex flex-col gap-3 w-full max-w-xs"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={handleSaveImage}
            className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold shadow-lg cursor-pointer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            💾 이미지 저장하기
          </motion.button>

          {typeof navigator !== "undefined" && "share" in navigator && (
            <motion.button
              onClick={handleShare}
              className="w-full py-3 bg-[var(--color-accent)] text-white rounded-xl font-bold shadow-md cursor-pointer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              📤 공유하기
            </motion.button>
          )}

          <motion.button
            onClick={handlePlayAgain}
            className="w-full py-3 bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl font-bold shadow-md border border-[var(--border-color)] cursor-pointer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            🐱 다른 {catName}이로 다시 하기
          </motion.button>

          <motion.button
            onClick={handleGoHome}
            className="text-sm text-[var(--text-secondary)] underline underline-offset-4 cursor-pointer mt-2"
            whileHover={{ scale: 1.05 }}
          >
            🏠 홈으로 돌아가기
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
}
