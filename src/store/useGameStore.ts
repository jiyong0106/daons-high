import { create } from "zustand";
import type { GameStateType } from "@/types/game";
import {
  generateSolvablePuzzle,
  moveTile as moveTileUtil,
  isComplete,
  getEmptyTile,
} from "@/utils/puzzleUtils";
import {
  sliceImage,
  getRandomCatImage,
  getCatNameFromPath,
} from "@/utils/imageUtils";
import {
  getStoredUserName,
  setStoredUserName as setLocalUserName,
} from "@/utils/rankingUtils";

import { auth } from "@/lib/firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { migrateUserRecords } from "@/api/userMigration";

/**
 * 게임의 전역 상태를 관리하는 Zustand 스토어
 * 컨벤션: use[Name]Store.ts 형식을 유지
 */
const useGameStore = create<GameStateType>((set, get) => ({
  userId: null, // 초기값 null, 인증 후 설정됨
  userName: getStoredUserName(),

  setUserId: (id: string) => set({ userId: id }),

  // 익명 로그인 초기화 함수
  initAuth: async () => {
    try {
      // 1. 이미 로그인되어 있는지 확인
      const currentUser = auth.currentUser;
      if (currentUser) {
        set({ userId: currentUser.uid });
        // 데이터 이관 시도
        await migrateUserRecords(currentUser.uid);
        return;
      }

      // 2. 인증 상태 변화 감지 및 로그인 실행
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          set({ userId: user.uid });
          // 인증 상태 변경 시 이관 시도
          await migrateUserRecords(user.uid);
        }
      });

      await signInAnonymously(auth);
    } catch (error) {
      console.error("Firebase 익명 로그인 실패:", error);
    }
  },

  setUserName: (name: string) => {
    setLocalUserName(name);
    set({ userName: name });
  },

  // 게임 설정
  gridSize: 3,

  gameStatus: "idle",
  selectedImage: null,
  catName: "고양이",
  tiles: [],
  tileSources: [],
  moveCount: 0,
  elapsedTime: 0,

  initGame: async (size?: number) => {
    const { selectedImage: prevImage, gridSize: currentSize } = get();
    const targetSize = size || currentSize;

    set({ gameStatus: "loading", gridSize: targetSize });

    try {
      // 랜덤 고양이 이미지 선택 (이전과 다른 이미지)
      const imageSrc = getRandomCatImage(prevImage);

      // 이미지 경로에서 이름 추출
      const catName = getCatNameFromPath(imageSrc);

      // Canvas로 이미지 슬라이싱 (동적 크기 반영)
      const tileSources = await sliceImage(imageSrc, targetSize);

      // 풀이 가능한 퍼즐 생성 (동적 크기 반영)
      const tiles = generateSolvablePuzzle(targetSize);

      set({
        gameStatus: "playing",
        selectedImage: imageSrc,
        catName,
        tiles,
        tileSources,
        moveCount: 0,
        elapsedTime: 0,
      });
    } catch (error) {
      console.error("게임 초기화 실패:", error);
      set({ gameStatus: "idle" });
    }
  },

  clickTile: (index: number) => {
    const { tiles, gameStatus, gridSize } = get();
    if (gameStatus !== "playing") return;

    // 빈칸 클릭은 무시
    const emptyTileValue = getEmptyTile(gridSize);
    if (tiles[index] === emptyTileValue) return;

    const newTiles = moveTileUtil(tiles, index, gridSize);
    if (!newTiles) return; // 인접하지 않으면 무시

    const completed = isComplete(newTiles);

    set((state) => ({
      tiles: newTiles,
      moveCount: state.moveCount + 1,
      gameStatus: completed ? "completed" : "playing",
    }));
  },

  resetGame: () => {
    set({
      gameStatus: "idle",
      selectedImage: null,
      tiles: [],
      tileSources: [],
      moveCount: 0,
      elapsedTime: 0,
    });
  },

  shuffleOnly: () => {
    const { gridSize } = get();
    const tiles = generateSolvablePuzzle(gridSize);
    set({
      tiles,
      moveCount: 0,
      elapsedTime: 0,
      gameStatus: "playing",
    });
  },

  setElapsedTime: (time: number) => {
    set({ elapsedTime: time });
  },
}));

export default useGameStore;
