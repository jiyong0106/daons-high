import { motion } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import { formatTime } from "../../hooks/useTimer";

export default function PuzzleControls() {
  const moveCount = useGameStore((s) => s.moveCount);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const shuffleOnly = useGameStore((s) => s.shuffleOnly);
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <motion.div
      className="w-full max-w-md mx-auto flex flex-col gap-4"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      {/* 스탯 영역 */}
      <div className="flex justify-center gap-8">
        {/* 타이머 */}
        <div className="flex items-center gap-2 bg-[var(--bg-surface)] px-4 py-2 rounded-xl shadow-sm">
          <span className="text-lg">⏱</span>
          <p className="text-lg font-bold text-[var(--text-primary)] tabular-nums">
            {formatTime(elapsedTime)}
          </p>
        </div>

        {/* 이동 횟수 */}
        <div className="flex items-center gap-2 bg-[var(--bg-surface)] px-4 py-2 rounded-xl shadow-sm">
          <span className="text-lg">👆</span>
          <p className="text-lg font-bold text-[var(--text-primary)] tabular-nums">
            {moveCount}
          </p>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center gap-3">
        <motion.button
          onClick={shuffleOnly}
          className="px-5 py-2.5 bg-[var(--color-accent)] text-white rounded-xl font-medium text-sm shadow-md cursor-pointer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          🔀 다시 섞기
        </motion.button>

        <motion.button
          onClick={resetGame}
          className="px-5 py-2.5 bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl font-medium text-sm shadow-md border border-[var(--border-color)] cursor-pointer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          🏠 홈으로
        </motion.button>
      </div>
    </motion.div>
  );
}
