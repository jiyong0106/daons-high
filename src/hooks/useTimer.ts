import { useEffect, useRef } from "react";
import useGameStore from "../store/useGameStore";

/**
 * 게임 타이머 커스텀 훅
 * - 게임 상태에 따라 자동 시작/정지
 * - 초 단위로 경과 시간 추적
 */
const useTimer = () => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const setElapsedTime = useGameStore((s) => s.setElapsedTime);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameStatus === "playing") {
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
};

export default useTimer;
