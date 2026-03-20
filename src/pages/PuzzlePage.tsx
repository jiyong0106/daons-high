import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGameStore } from "../stores/gameStore";
import { useTimer } from "../hooks/useTimer";
import Layout from "../components/layout/Layout";
import PuzzleBoard from "../features/puzzle/PuzzleBoard";
import PuzzleControls from "../features/puzzle/PuzzleControls";
import PuzzleComplete from "../features/puzzle/PuzzleComplete";

export default function PuzzlePage() {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const initGame = useGameStore((s) => s.initGame);
  const navigate = useNavigate();

  // 타이머 훅 활성화
  useTimer();

  // 게임이 초기화되지 않았으면 메인으로 리디렉트
  useEffect(() => {
    if (gameStatus === "idle") {
      navigate("/", { replace: true });
    }
  }, [gameStatus, navigate]);

  // 로딩 중
  if (gameStatus === "loading") {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🐱
            </motion.div>
            <p className="text-[var(--text-secondary)]">
              다온이와 라온이를 데려오는 중...
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-start gap-3 px-4 py-6">
        {/* 헤더 */}
        <motion.div
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            🧩 퍼즐을 맞춰보세요!
          </h1>
        </motion.div>

        {/* 퍼즐 보드 */}
        <PuzzleBoard />

        {/* 컨트롤 영역 */}
        <PuzzleControls />

        {/* 다른 고양이로 새 게임 버튼 */}
        <motion.button
          onClick={async () => {
            await initGame();
          }}
          className="text-sm text-[var(--color-accent)] underline underline-offset-4 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          🐱 다른 사진으로 시작하기
        </motion.button>
      </div>

      {/* 완성 오버레이 */}
      <PuzzleComplete />
    </Layout>
  );
}
