import { create } from "zustand";
import type { GameStateType } from "../types/game";
import {
  generateSolvablePuzzle,
  moveTile as moveTileUtil,
  isComplete,
  getEmptyTile,
} from "../utils/puzzleUtils";
import {
  sliceImage,
  getRandomCatImage,
  getCatNameFromPath,
} from "../utils/imageUtils";
import {
  getStoredUserName,
  setStoredUserName as setLocalUserName,
} from "../utils/rankingUtils";

/**
 * 게임의 전역 상태를 관리하는 Zustand 스토어
 * 컨벤션: use[Name]Store.ts 형식을 유지
 */
const useGameStore = create<GameStateType>((set, get) => ({
  userId: (() => {
    const stored = localStorage.getItem("daons_high_user_id");
    if (stored) return stored;
    const newId = crypto.randomUUID();
    localStorage.setItem("daons_high_user_id", newId);
    return newId;
  })(),
  userName: getStoredUserName(),
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
