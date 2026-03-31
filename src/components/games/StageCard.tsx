import { motion } from "framer-motion";
import type { GameMetadataType } from "../../types/game";

interface Props {
  game: GameMetadataType;
  index: number;
  onClick: (id: string) => void;
}

/**
 * 게임 스테이지 선택 카드 컴포넌트
 * - 난이도별 색상 테마 및 호버 애니메이션 포함
 */
const StageCard = ({ game, index, onClick }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(game.id)}
      className="bg-(--bg-primary) rounded-3xl p-5 shadow-xl border-2 border-(--border-color) cursor-pointer relative overflow-hidden group"
    >
      {/* 배경 장식 패턴 (반투명) */}

      <div className="flex-1">
        <div className=" pb-2 flex items-center gap-4 border-b border-(--border-color) border-dashed">
          <h2 className="text-lg font-bold text-(--text-primary)">
            {game.title}
          </h2>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
              game.difficulty === "Easy"
                ? "text-green-500 border-green-200 bg-green-50"
                : game.difficulty === "Normal"
                  ? "text-blue-500 border-blue-200 bg-blue-50"
                  : "text-red-500 border-red-200 bg-red-50"
            }`}
          >
            {game.difficulty}
          </span>
          <span className="text-sm font-black text-(--color-primary)">
            {game.gridSize} x {game.gridSize}
          </span>
        </div>

        <p className="pt-2 text-xs text-(--text-secondary) leading-relaxed line-clamp-2">
          {game.description}
        </p>
      </div>
    </motion.div>
  );
};

export default StageCard;
