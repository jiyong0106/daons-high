/**
 * 3x3 퍼즐 보드 컴포넌트
 * - 반응형 크기 조절
 * - 타일 배치 및 이동 처리
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import PuzzleTile from './PuzzleTile';

export default function PuzzleBoard() {
  const tiles = useGameStore((s) => s.tiles);
  const tileSources = useGameStore((s) => s.tileSources);
  const clickTile = useGameStore((s) => s.clickTile);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(0);

  // 반응형 보드 크기 계산
  const updateBoardSize = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      // 최대 450px, 컨테이너 너비의 95%
      const size = Math.min(450, containerWidth * 0.95);
      setBoardSize(size);
    }
  }, []);

  useEffect(() => {
    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, [updateBoardSize]);

  if (tiles.length === 0 || tileSources.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="w-full flex justify-center items-center">
      <motion.div
        className="relative bg-[var(--color-primary)]/10 rounded-2xl p-1 shadow-2xl"
        style={{
          width: boardSize + 8,
          height: boardSize + 8,
        }}
        initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
          delay: 0.2,
        }}
      >
        {/* 퍼즐 보드 내부 */}
        <div
          className="relative bg-[var(--bg-surface)] rounded-xl overflow-hidden"
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
    </div>
  );
}
