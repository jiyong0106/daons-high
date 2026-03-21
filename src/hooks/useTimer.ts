/**
 * 게임 타이머 커스텀 훅
 * - 게임 상태에 따라 자동 시작/정지
 * - 초 단위로 경과 시간 추적
 */

import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

export function useTimer() {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const setElapsedTime = useGameStore((s) => s.setElapsedTime);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameStatus === 'playing') {
      // 게임 시작 시 타이머 시작
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      // 게임 종료 또는 상태 변경 시 타이머 정지
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameStatus, setElapsedTime]);
}

/**
 * 초를 MM:SS 형식으로 포맷.
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
}
