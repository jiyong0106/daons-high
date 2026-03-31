import { memo } from "react";
import { motion } from "framer-motion";
import useGameStore from "@/store/useGameStore";
import { getEmptyTile } from "@/utils/puzzleUtils";

interface Props {
  tileValue: number; // 타일 번호
  currentIndex: number; // 현재 보드상 위치
  imageSrc: string; // 타일 이미지 data URL
  boardSize: number; // 보드 전체 크기 (px)
  onClick: (index: number) => void;
}

/**
 * 개별 퍼즐 타일 컴포넌트
 */
const PuzzleTile = memo(({
  tileValue,
  currentIndex,
  imageSrc,
  boardSize,
  onClick,
}: Props) => {
  const gridSize = useGameStore((s) => s.gridSize);
  const tileSize = boardSize / gridSize;
  const emptyTileValue = getEmptyTile(gridSize);
  const isEmptyTile = tileValue === emptyTileValue;

  const row = Math.floor(currentIndex / gridSize);
  const col = currentIndex % gridSize;

  const handleClick = () => {
    if (isEmptyTile) return;

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    onClick(currentIndex);
  };

  return (
    <motion.div
      layout
      className="absolute cursor-pointer"
      style={{
        width: tileSize,
        height: tileSize,
      }}
      animate={{
        x: col * tileSize,
        y: row * tileSize,
        opacity: isEmptyTile ? 0 : 1,
        scale: isEmptyTile ? 0.8 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
      }}
      whileTap={!isEmptyTile ? { scale: 0.95 } : undefined}
      onClick={handleClick}
    >
      {!isEmptyTile && (
        <div
          className="w-full h-full rounded-lg overflow-hidden shadow-md"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
    </motion.div>
  );
});

export default PuzzleTile;
