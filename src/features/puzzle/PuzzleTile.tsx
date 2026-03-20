/**
 * 개별 퍼즐 타일 컴포넌트
 * - Framer Motion으로 부드러운 이동 애니메이션
 * - 빈칸은 투명 처리
 * - 클릭 시 진동 피드백 (모바일)
 */

import { motion } from "framer-motion";
import { EMPTY_TILE, GRID_SIZE } from "../../utils/puzzleUtils";

interface PuzzleTileProps {
  tileValue: number; // 타일 번호 (0-8)
  currentIndex: number; // 현재 보드상 위치 (0-8)
  imageSrc: string; // 타일 이미지 data URL
  boardSize: number; // 보드 전체 크기 (px)
  onClick: (index: number) => void;
}

export default function PuzzleTile({
  tileValue,
  currentIndex,
  imageSrc,
  boardSize,
  onClick,
}: PuzzleTileProps) {
  const tileSize = boardSize / GRID_SIZE;
  const isEmptyTile = tileValue === EMPTY_TILE;

  // 현재 위치의 행/열 계산
  const row = Math.floor(currentIndex / GRID_SIZE);
  const col = currentIndex % GRID_SIZE;

  const handleClick = () => {
    if (isEmptyTile) return;

    // 모바일 햅틱 피드백
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    onClick(currentIndex);
  };

  return (
    <motion.div
      layout // Framer Motion layout animation
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
}
