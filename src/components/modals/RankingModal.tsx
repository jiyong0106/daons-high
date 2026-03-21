import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGlobalRankings, type RankingEntry } from "../../api/rankingService";
import { formatTime } from "../../hooks/useTimer";

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RankingModal({ isOpen, onClose }: RankingModalProps) {
  const [activeTab, setActiveTab] = useState<"score_time" | "move_count">(
    "score_time",
  );
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRankings(activeTab);
    }
  }, [isOpen, activeTab]);

  const loadRankings = async (sortBy: "score_time" | "move_count") => {
    setIsLoading(true);
    const data = await getGlobalRankings(sortBy);
    setRankings(data);
    setIsLoading(false);
  };

  const renderRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return rank;
    }
  };

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
            className="relative w-full max-w-sm bg-[var(--bg-primary)] rounded-3xl px-3 py-5 shadow-2xl border-2 border-[var(--color-primary)] flex flex-col max-h-[100vh]"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <div className="text-center mb-3">
              {/* 헤더 */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl  block">🏆</span>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  명예의 전당
                </h2>
              </div>
              {/* 탭 스위처 */}
              <div className="flex bg-[var(--bg-surface)] p-1 rounded-xl mt-5 relative border border-[var(--border-color)]">
                <motion.div
                  className="absolute top-1 bottom-1 bg-[var(--color-primary)] rounded-lg shadow-sm"
                  initial={false}
                  animate={{
                    left: activeTab === "score_time" ? "4px" : "50%",
                    right: activeTab === "score_time" ? "50%" : "4px",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <button
                  onClick={() => setActiveTab("score_time")}
                  className={`flex-1 py-1.5 text-xs  z-10 transition-colors duration-200 ${
                    activeTab === "score_time"
                      ? "text-white"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  ⏱ 최소 시간
                </button>
                <button
                  onClick={() => setActiveTab("move_count")}
                  className={`flex-1 py-1.5 text-xs  z-10 transition-colors duration-200 ${
                    activeTab === "move_count"
                      ? "text-white"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  👆 최소 이동
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[200px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <motion.div
                    className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              ) : rankings.length === 0 ? (
                <div className="text-center py-10 text-[var(--text-secondary)] opacity-60">
                  <p>아직 기록이 없어요.</p>
                  <p className="text-xs">첫 번째 랭커가 되어보세요!</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {rankings.map((entry, index) => (
                    <motion.li
                      key={`${activeTab}-${entry.user_id}`}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                      className="flex items-center gap-3 p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)]"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-primary)] font-bold text-sm text-[var(--color-primary)]">
                        {renderRankIcon(index + 1)}
                      </div>

                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* <span className="text-lg opacity-80">
                            {entry.cat_name === "라온" ? "🧧" : "🎴"}
                          </span> */}
                          <div>
                            <p className="font-bold text-[var(--text-primary)] text-sm">
                              {entry.nickname}
                            </p>
                            <p className="text-[10px] text-[var(--text-secondary)] opacity-70">
                              {entry.created_at
                                ? new Date(
                                    entry.created_at,
                                  ).toLocaleDateString()
                                : ""}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          {activeTab === "score_time" ? (
                            <>
                              <p className="font-black text-[var(--color-primary)] text-lg tabular-nums leading-tight">
                                {formatTime(entry.score_time)}
                              </p>
                              <p className="text-[10px] text-[var(--text-secondary)]">
                                {entry.move_count}회 이동
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-black text-[var(--color-primary)] text-lg tabular-nums leading-tight">
                                {entry.move_count}회
                              </p>
                              <p className="text-[10px] text-[var(--text-secondary)]">
                                {formatTime(entry.score_time)}
                              </p>
                            </>
                          )}
                        </div>
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
