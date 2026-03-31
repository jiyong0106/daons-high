import { create } from "zustand";
import type { GameStateType } from "../types/game";
import {
  generateSolvablePuzzle,
  moveTile as moveTileUtil,
  isComplete,
  EMPTY_TILE,
} from "../utils/puzzleUtils";
import {
  sliceImage,
  getRandomCatImage,
  getCatNameFromPath,
} from "../utils/imageUtils";
import { getStoredUserName, setStoredUserName as setLocalUserName } from "../utils/rankingUtils";

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
  gameStatus: "idle",
  selectedImage: null,
  catName: "고양이",
  tiles: [],
  tileSources: [],
  moveCount: 0,
  elapsedTime: 0,

  initGame: async () => {
    const { selectedImage: prevImage } = get();
    set({ gameStatus: "loading" });

    try {
      // 랜덤 고양이 이미지 선택 (이전과 다른 이미지)
      const imageSrc = getRandomCatImage(prevImage);

      // 이미지 경로에서 이름 추출
      const catName = getCatNameFromPath(imageSrc);

      // Canvas로 이미지 슬라이싱
      const tileSources = await sliceImage(imageSrc);

      // 풀이 가능한 퍼즐 생성
      const tiles = generateSolvablePuzzle();

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
    const { tiles, gameStatus } = get();
    if (gameStatus !== "playing") return;

    // 빈칸 클릭은 무시
    if (tiles[index] === EMPTY_TILE) return;

    const newTiles = moveTileUtil(tiles, index);
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
    const tiles = generateSolvablePuzzle();
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
