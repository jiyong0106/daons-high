import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import useGameStore from "../../store/useGameStore";
import PuzzleTile from "./PuzzleTile";
import { PUZZLE_MESSAGES } from "../../constants/messages";

/**
 * 퍼즐 보드 컴포넌트
 * - 반응형 크기 계산 및 3D 플립 애니메이션 (원본 힌트)
 */
const PuzzleBoard = () => {
  const tiles = useGameStore((s) => s.tiles);
  const tileSources = useGameStore((s) => s.tileSources);
  const selectedImage = useGameStore((s) => s.selectedImage);
  const clickTile = useGameStore((s) => s.clickTile);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // 반응형 보드 크기 계산 로직
  const updateBoardSize = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const size = Math.min(450, containerWidth * 0.95);
      setBoardSize(size);
    }
  }, []);

  useEffect(() => {
    updateBoardSize();
    window.addEventListener("resize", updateBoardSize);
    return () => window.removeEventListener("resize", updateBoardSize);
  }, [updateBoardSize]);

  if (tiles.length === 0 || tileSources.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center gap-2">
      {/* 썸네일 + 힌트 안내 */}
      <motion.div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setIsFlipped((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-(--color-accent) shadow-md">
          <img
            src={selectedImage || ""}
            alt="원본 이미지"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xs text-(--text-secondary) flex items-center gap-1">
          {isFlipped ? PUZZLE_MESSAGES.PUZZLE_RETURN : PUZZLE_MESSAGES.ORIGINAL_VIEW}
        </span>
      </motion.div>

      {/* 3D 플립 컨테이너 */}
      <div
        style={{
          width: boardSize + 8,
          height: boardSize + 8,
          perspective: 1200,
        }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 25,
            mass: 1,
          }}
        >
          {/* 앞면: 퍼즐 보드 */}
          <motion.div
            className="absolute inset-0 bg-white rounded-2xl p-1 shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
          >
            <div
              className="relative rounded-xl overflow-hidden"
              style={{ width: boardSize, height: boardSize }}
            >
              {tiles.map((tileValue, index) => (
                <PuzzleTile
                  key={tileValue}
                  tileValue={tileValue}
                  currentIndex={index}
                  imageSrc={tileSources[tileValue]}
                  boardSize={boardSize}
                  onClick={clickTile}
                />
              ))}
            </div>
          </motion.div>

          {/* 뒷면: 원본 이미지 힌트 */}
          <div
            className="absolute inset-0 rounded-2xl p-1 shadow-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            onClick={() => setIsFlipped((prev) => !prev)}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <img
                src={selectedImage || ""}
                alt="원본 고양이"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20 rounded-xl" />
              <div className="absolute top-3 left-3 bg-(--color-accent) text-white text-xs px-3 py-1 rounded-full shadow-md">
                💡 원본 이미지
              </div>
              <div className="absolute bottom-3 left-0 right-0 text-center ">
                <span className="text-white text-sm px-3 py-1 rounded-full bg-(--color-accent)">
                  👆 탭하여 퍼즐로 돌아가기
                </span>
              </div>
              <div className="absolute inset-0 border-3 border-(--color-accent) rounded-xl opacity-60" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PuzzleBoard;
