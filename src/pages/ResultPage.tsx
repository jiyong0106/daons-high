import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import useGameStore from "@/store/useGameStore";
import { formatTime } from "@/utils/formatter";
import { useAddRanking } from "@/hooks/useRankings";
import Layout from "@/components/layout/Layout";

/**
 * 게임 완료 후 최종 결과와 기록을 보여주는 페이지 컴포넌트
 * - 결과 카드 캡처 및 공유 기능 포함
 * - 랭킹 자동 등록 로직 포함
 */
const ResultPage = () => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    gameStatus,
    selectedImage,
    moveCount,
    elapsedTime,
    catName,
    userName,
    userId,
    resetGame,
    initGame,
  } = useGameStore();

  const { mutate: addRanking } = useAddRanking();

  // 게임 완료 시 랭킹 저장 (React Query Mutation)
  useEffect(() => {
    if (gameStatus === "completed" && userName && userId) {
      addRanking({
        user_id: userId,
        nickname: userName,
        score_time: elapsedTime,
        move_count: moveCount,
        cat_name: catName,
      });
    }
  }, [gameStatus, userName, userId, elapsedTime, moveCount, catName, addRanking]);

  // 게임 완료 상태가 아니면 메인으로
  useEffect(() => {
    if (gameStatus !== "completed") {
      navigate("/", { replace: true });
    }
  }, [gameStatus, navigate]);

  // 기록 카드 캡처 및 공유 기능 (Web Share API)
  const handleShareRecord = async () => {
    if (!navigator.share || !cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        scrollX: 0,
        scrollY: -window.scrollY,
        backgroundColor: "#fff8f0",
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `daons-high-${catName}.png`, {
          type: "image/png",
        });

        await navigator.share({
          title: "다온스하이 - 퍼즐 완성!",
          text: `🐱 ${catName}이 퍼즐을 ${formatTime(elapsedTime)}에 ${moveCount}회 이동으로 맞췄어요!`,
          files: [file],
        });
      }, "image/png");
    } catch {
      // 공유 취소 시 예외 처리
    }
  };

  const handlePlayAgain = async () => {
    await initGame();
    navigate("/puzzle");
  };

  const handleGoHome = () => {
    resetGame();
    navigate("/");
  };

  if (gameStatus !== "completed") return null;

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
        {/* 캡처 대상 영역 */}
        <div
          ref={cardRef}
          className="flex flex-col items-center gap-6 p-4 bg-(--bg-primary) rounded-3xl"
        >
          <motion.div
            className="text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-(--text-primary) mb-2">
              🎉 축하합니다!
            </h1>
            <p className="text-(--text-secondary)">
              귀여운 {catName}이를 완성했어요!
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
              <div className="absolute -inset-3 border-2 border-(--color-primary) rounded-3xl opacity-30 rotate-1" />
              <div className="absolute -inset-3 border-2 border-(--color-accent) rounded-3xl opacity-20 -rotate-1" />

              <img
                src={selectedImage}
                alt="완성된 고양이"
                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
          )}

          {/* 기록 카드 */}
          <motion.div
            className="flex gap-6 bg-(--bg-surface) px-8 py-4 rounded-2xl shadow-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <p className="text-xs text-(--text-secondary) mb-1">⏱ 소요 시간</p>
              <p className="text-2xl font-bold text-(--color-primary) tabular-nums">
                {formatTime(elapsedTime)}
              </p>
            </div>
            <div className="w-px bg-(--border-color)" />
            <div className="text-center">
              <p className="text-xs text-(--text-secondary) mb-1">👆 이동 횟수</p>
              <p className="text-2xl font-bold text-(--color-primary) tabular-nums">
                {moveCount}회
              </p>
            </div>
          </motion.div>
        </div>

        {/* 액션 버튼들 */}
        <motion.div
          className="flex flex-col gap-3 w-full max-w-xs"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {typeof navigator !== "undefined" && "share" in navigator && (
            <motion.button
              onClick={handleShareRecord}
              className="w-full py-3 bg-(--color-accent) text-white rounded-xl font-bold shadow-md cursor-pointer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              📤 기록 자랑하기
            </motion.button>
          )}

          <motion.button
            onClick={handlePlayAgain}
            className="w-full py-3 bg-(--bg-surface) text-(--text-primary) rounded-xl font-bold shadow-md border border-(--border-color) cursor-pointer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            🐱 다른 {catName}이로 다시 하기
          </motion.button>

          <motion.button
            onClick={handleGoHome}
            className="text-sm text-(--text-secondary) underline underline-offset-4 cursor-pointer mt-2"
            whileHover={{ scale: 1.05 }}
          >
            🏠 홈으로 돌아가기
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ResultPage;
