import { useEffect, useState } from "react";
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
  const [loadingMsg, setLoadingMsg] = useState("");

  // 타이머 훅 활성화
  useTimer();

  // 게임이 초기화되지 않았으면 메인으로 리디렉트
  useEffect(() => {
    if (gameStatus === "idle") {
      navigate("/", { replace: true });
    }
  }, [gameStatus, navigate]);

  // 로딩 메시지 랜덤 선택
  useEffect(() => {
    if (gameStatus === "loading") {
      const messages = [
        "맛있는 츄르 먹는 중...",
        "캣타워에 올라가는 중...",
        "창밖 구경하는 중...",
        "따듯한 곳에서 낮잠 자는 중...",
        "맹수가 되어 장난감 사냥하는 중...",
        "기분 좋아 꾹꾹이 하는 중...",
        "냥빨하고 그루밍 하는 중...",
        "집사가 불러서 쳐다보는 중...",
        "집사 무릎에 앉아있는 중...",
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setLoadingMsg(randomMsg);
    }
  }, [gameStatus]);

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
          className="text-sm text-(--color-accent) underline underline-offset-4 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          🐱 다른 사진으로 다시하기
        </motion.button>
      </div>

      {/* 완성 오버레이 */}
      <PuzzleComplete />
    </Layout>
  );
}
