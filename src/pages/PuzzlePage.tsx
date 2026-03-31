import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useGameStore from "../store/useGameStore";
import useTimer from "../hooks/useTimer";
import Layout from "../components/layout/Layout";
import PuzzleBoard from "../components/puzzle/PuzzleBoard";
import PuzzleControls from "../components/puzzle/PuzzleControls";
import PuzzleComplete from "../components/puzzle/PuzzleComplete";
import { PUZZLE_MESSAGES } from "../constants/messages";
import { GAMES } from "../constants/games";

/**
 * 실제 퍼즐 게임이 진행되는 페이지 컴포넌트
 */
const PuzzlePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const gameStatus = useGameStore((s) => s.gameStatus);
  const initGame = useGameStore((s) => s.initGame);
  const navigate = useNavigate();
  const [loadingMsg, setLoadingMsg] = useState("");

  // 타이머 훅 활성화 (로직 추출 완료)
  useTimer();

  // 게임 초기화 로직
  useEffect(() => {
    const gameConfig = GAMES.find((g) => g.id === gameId);

    if (!gameConfig) {
      navigate("/", { replace: true });
      return;
    }

    initGame(gameConfig.gridSize);
  }, [gameId, initGame, navigate]);

  // 로딩 메시지 랜덤 선택 (상수 활용)
  useEffect(() => {
    if (gameStatus === "loading") {
      const messages = PUZZLE_MESSAGES.LOADING;
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setLoadingMsg(randomMsg);
    }
  }, [gameStatus]);

  // 로딩 중 레이아웃
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
            <p className="text-(--text-secondary)">{loadingMsg}</p>
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
          <h1 className="text-xl font-bold text-(--text-primary)">
            {PUZZLE_MESSAGES.HEADER}
          </h1>
        </motion.div>

        {/* 퍼즐 보드 */}
        <PuzzleBoard />

        {/* 컨트롤 영역 (기록 및 버튼) */}
        <PuzzleControls />

        {/* 다시하기 버튼 */}
        <motion.button
          onClick={async () => {
            await initGame();
          }}
          className="text-sm text-(--color-accent) underline underline-offset-4 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {PUZZLE_MESSAGES.RETRY}
        </motion.button>
      </div>

      {/* 완성 오버레이 모달 */}
      <PuzzleComplete />
    </Layout>
  );
};

export default PuzzlePage;
