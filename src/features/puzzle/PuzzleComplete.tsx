import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../../stores/gameStore";
import { formatTime } from "../../hooks/useTimer";

// 떨어지는 별/고양이발 파티클
function Particles() {
  const emojis = ["⭐", "🐾", "✨", "🎉", "🐱", "💛"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: -30,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: "110vh",
            rotate: Math.random() * 720 - 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2.5 + Math.random() * 2,
            delay: Math.random() * 1.5,
            ease: "easeIn",
          }}
        >
          {emojis[i % emojis.length]}
        </motion.span>
      ))}
    </div>
  );
}

export default function PuzzleComplete() {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const moveCount = useGameStore((s) => s.moveCount);
  const elapsedTime = useGameStore((s) => s.elapsedTime);
  const selectedImage = useGameStore((s) => s.selectedImage);
  const navigate = useNavigate();

  const isCompleted = gameStatus === "completed";

  return (
    <AnimatePresence>
      {isCompleted && (
        <>
          <Particles />

          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* 완성 모달 */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[var(--bg-primary)] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.3,
              }}
            >
              {/* 성공 이모지 */}
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 500 }}
              >
                🎊
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-[var(--text-primary)] mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                퍼즐 완성!
              </motion.h2>

              <motion.p
                className="text-[var(--text-secondary)] mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                귀여운 {useGameStore.getState().catName}이를 완성했어요! 🐱
              </motion.p>

              {/* 완성된 이미지 미리보기 */}
              {selectedImage && (
                <motion.div
                  className="w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg border-4 border-[var(--color-accent)]"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                >
                  <img
                    src={selectedImage}
                    alt="완성된 고양이"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}

              {/* 기록 */}
              <motion.div
                className="flex justify-center gap-6 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <div className="text-center">
                  <p className="text-xs text-[var(--text-secondary)]">
                    소요 시간
                  </p>
                  <p className="text-xl font-bold text-[var(--color-primary)]">
                    {formatTime(elapsedTime)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[var(--text-secondary)]">
                    이동 횟수
                  </p>
                  <p className="text-xl font-bold text-[var(--color-primary)]">
                    {moveCount}회
                  </p>
                </div>
              </motion.div>

              {/* 버튼 */}
              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <motion.button
                  onClick={() => navigate("/result")}
                  className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold text-base shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  🖼 결과 확인하기
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
