import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { GAMES } from "@/constants/games";
import { StageCard } from "@/components/games";

/**
 * 게임 목록 페이지
 * - 사용 가능한 모든 퍼즐 게임/난이도를 카드 형태로 제공
 */
const GamesPage = () => {
  const navigate = useNavigate();

  const handleGameSelect = (gameId: string) => {
    navigate(`/games/puzzle/${gameId}`);
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center p-6 pb-20 relative">
        {/* 상단 헤더 섹션 */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-(--text-primary) tracking-tight">
              반갑다온
            </h1>
            <span className="text-3xl md:text-7xl relative z-10 leading-none">
              🐱
            </span>
          </div>
          <p className="text-sm text-(--text-secondary) mt-2 opacity-80">
            도전할 난이도를 선택해라온
          </p>
        </motion.div>

        {/* 게임 카드 리스트 */}
        <div className="w-full max-w-md flex flex-col gap-5">
          {GAMES.map((game, index) => (
            <StageCard
              key={game.id}
              game={game}
              index={index}
              onClick={handleGameSelect}
            />
          ))}
        </div>

        {/* 하단 돌아가기 버튼 */}
        <motion.button
          onClick={() => navigate("/")}
          className="mt-12 text-(--text-secondary) text-sm underline underline-offset-4 opacity-60 hover:opacity-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
        >
          로비로 돌아가기
        </motion.button>
      </div>
    </Layout>
  );
};

export default GamesPage;
