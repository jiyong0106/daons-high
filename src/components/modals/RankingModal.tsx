import { motion, AnimatePresence } from "framer-motion";
import { getRankings } from "../../utils/rankingUtils";
import { formatTime } from "../../hooks/useTimer";

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RankingModal({ isOpen, onClose }: RankingModalProps) {
  const rankings = getRankings();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            className="relative w-full max-w-sm bg-[var(--bg-primary)] rounded-3xl p-6 shadow-2xl border-2 border-[var(--color-primary)] flex flex-col max-h-[80vh]"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🏆</span>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                명예의 전당
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                상위 10위까지의 기록입니다
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {rankings.length === 0 ? (
                <div className="text-center py-10 text-[var(--text-secondary)] opacity-60">
                  <p>아직 기록이 없어요.</p>
                  <p className="text-xs">첫 번째 랭커가 되어보세요!</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {rankings.map((entry, index) => (
                    <motion.li
                      key={entry.date}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        index === 0
                          ? "bg-[var(--color-accent)]/10 border-[var(--color-accent)]"
                          : "bg-[var(--bg-surface)] border-[var(--border-color)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-black w-6 text-center ${
                          index < 3 ? "text-[var(--color-primary)] text-lg" : "text-[var(--text-secondary)]"
                        }`}>
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                        </span>
                        <div>
                          <p className="font-bold text-[var(--text-primary)] text-sm">
                            {entry.userName}
                          </p>
                          <p className="text-[10px] text-[var(--text-secondary)] opacity-70">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[var(--color-primary)] tabular-nums">
                          {formatTime(entry.time)}
                        </p>
                        <p className="text-[10px] text-[var(--text-secondary)]">
                          {entry.moveCount}회 이동
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            <motion.button
              onClick={onClose}
              className="w-full py-3 mt-6 bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl font-bold shadow-md border border-[var(--border-color)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              닫기
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
