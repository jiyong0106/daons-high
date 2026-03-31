import { memo } from "react";
import { motion } from "framer-motion";
import { EMPTY_TILE, GRID_SIZE } from "../../utils/puzzleUtils";

interface Props {
  tileValue: number; // 타일 번호 (0-8)
  currentIndex: number; // 현재 보드상 위치 (0-8)
  imageSrc: string; // 타일 이미지 data URL
  boardSize: number; // 보드 전체 크기 (px)
  onClick: (index: number) => void;
}

/**
 * 개별 퍼즐 타일 컴포넌트
 * - React.memo를 사용하여 부모 렌더링 시 불필요한 리렌더링 방지 (성능 최적화)
 */
const PuzzleTile = memo(({
  tileValue,
  currentIndex,
  imageSrc,
  boardSize,
  onClick,
}: Props) => {
  const tileSize = boardSize / GRID_SIZE;
  const isEmptyTile = tileValue === EMPTY_TILE;

  const row = Math.floor(currentIndex / GRID_SIZE);
  const col = currentIndex % GRID_SIZE;

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
