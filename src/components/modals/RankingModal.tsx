import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { rankingKeys, useGetRankings } from "@/hooks/useRankings";
import { getGlobalRankings } from "@/api/rankingService";
import { formatTime, formatDate } from "@/utils/formatter";
import useGameStore from "@/store/useGameStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GRID_SIZES = [3, 4, 5];

/**
 * 전역 랭킹(명예의 전당)을 보여주는 모달 컴포넌트
 * - 난이도별(3x3, 4x4, 5x5) 및 정렬 기준별 필터링 지원
 */
const RankingModal = ({ isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();
  const currentGameSize = useGameStore((s) => s.gridSize);

  // 난이도 선택 상태 (기존 게임 사이즈로 초기화)
  const [selectedGridSize, setSelectedGridSize] = useState(currentGameSize);
  const [activeTab, setActiveTab] = useState<"score_time" | "move_count">(
    "score_time",
  );

  // 모달이 열릴 때 현재 진행 중인 게임의 난이도를 기본값으로 설정
  useEffect(() => {
    if (isOpen) {
      setSelectedGridSize(currentGameSize);
    }
  }, [isOpen, currentGameSize]);

  const {
    data: rankings = [],
    isLoading,
    isFetching,
  } = useGetRankings(selectedGridSize, activeTab);

  // 현재 탭 반대편 탭의 데이터를 미리 로딩(Prefetch)
  useEffect(() => {
    if (isOpen) {
      const otherTab = activeTab === "score_time" ? "move_count" : "score_time";
      queryClient.prefetchQuery({
        queryKey: rankingKeys.list(selectedGridSize, otherTab),
        queryFn: () => getGlobalRankings(otherTab, selectedGridSize),
      });
    }
  }, [isOpen, queryClient, activeTab, selectedGridSize]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: rankingKeys.all });
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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
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
            className="relative w-full max-w-sm bg-(--bg-primary) rounded-3xl px-3 pt-5 pb-3 shadow-2xl border-2 border-(--color-primary) flex flex-col max-h-[85vh]"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <div className="text-center mb-3">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-4xl block">🏆</span>
                <h2 className="text-xl font-bold text-(--text-primary)">
                  명예의 전당
                </h2>
                <motion.button
                  onClick={handleRefresh}
                  className={`p-1.5 text-(--text-secondary) hover:text-(--color-primary) transition-colors rounded-full hover:bg-(--bg-primary) opacity-60 hover:opacity-100 ${
                    isFetching ? "animate-spin" : ""
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ rotate: 180 }}
                  title="새로고침"
                  disabled={isFetching}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                  </svg>
                </motion.button>
              </div>

              {/* 난이도(Board Size) 선택 탭 */}
              <div className="flex gap-2 mb-3">
                {GRID_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedGridSize(size)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                      selectedGridSize === size
                        ? "bg-(--color-primary) border-(--color-primary) text-white shadow-md"
                        : "bg-(--bg-surface) border-(--border-color) text-(--text-secondary) opacity-60"
                    }`}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>

              {/* 정렬 기준 탭 전환 버튼 */}
              <div className="flex bg-(--bg-surface) p-1 rounded-xl relative border border-(--border-color)">
                <motion.div
                  className="absolute top-1 bottom-1 bg-(--color-primary) rounded-lg shadow-sm"
                  initial={false}
                  animate={{
                    left: activeTab === "score_time" ? "4.545px" : "50%",
                    right: activeTab === "score_time" ? "50%" : "4.545px",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <button
                  onClick={() => setActiveTab("score_time")}
                  className={`flex-1 py-1.5 text-xs z-10 transition-colors duration-200 ${
                    activeTab === "score_time"
                      ? "text-white font-bold"
                      : "text-(--text-secondary)"
                  }`}
                >
                  ⏱ 최소 시간
                </button>
                <button
                  onClick={() => setActiveTab("move_count")}
                  className={`flex-1 py-1.5 text-xs z-10 transition-colors duration-200 ${
                    activeTab === "move_count"
                      ? "text-white font-bold"
                      : "text-(--text-secondary)"
                  }`}
                >
                  👆 최소 이동
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[200px]">
              {isLoading && rankings.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <motion.div
                    className="w-10 h-10 border-4 border-(--color-primary) border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              ) : rankings.length === 0 ? (
                <div className="text-center py-10 text-(--text-secondary) opacity-60">
                  <p>아직 기록이 없어요.</p>
                  <p className="text-xs">첫 번째 랭커가 되어보세요!</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-1 p-2">
                  {rankings.map((entry, index) => (
                    <motion.li
                      key={`${activeTab}-${entry.user_id}`}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                      className="flex items-center gap-3 py-2 px-3 bg-(--bg-surface) rounded-xl border border-(--border-color)"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-(--bg-primary) font-bold text-sm text-(--color-primary)">
                        {renderRankIcon(index + 1)}
                      </div>

                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <p className="font-bold text-(--text-primary) text-sm">
                            {entry.nickname}
                          </p>
                          <p className="text-[11px] text-(--text-secondary)">
                            {entry.updated_at
                              ? formatDate(entry.updated_at)
                              : ""}
                          </p>
                        </div>

                        <div className="text-right">
                          {activeTab === "score_time" ? (
                            <div className="flex flex-col gap-0.5">
                              <p className="font-black text-(--color-primary) text-lg tabular-nums leading-tight">
                                {formatTime(entry.score_time)}
                              </p>
                              <p className="text-[11px] text-(--text-secondary)">
                                {entry.move_count}회 이동
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-0.5">
                              <p className="font-black text-(--color-primary) text-lg tabular-nums leading-tight">
                                {entry.move_count}회
                              </p>
                              <p className="text-[11px] text-(--text-secondary)">
                                {formatTime(entry.score_time)}
                              </p>
                            </div>
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
              className="py-3 mt-3 bg-(--bg-surface) text-(--text-primary) rounded-xl font-bold shadow-md border border-(--border-color)"
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
};

export default RankingModal;
