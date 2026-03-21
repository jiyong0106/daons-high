import { create } from "zustand";
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

export type GameStatus = "idle" | "loading" | "playing" | "completed";

interface GameState {
  // 사용자 정보
  userId: string; // 고유 식별자 (로컬 스토리지 저장)
  userName: string | null;
  setUserName: (name: string) => void;

  // 게임 상태
  gameStatus: GameStatus;
  selectedImage: string | null; // 선택된 원본 이미지 경로
  catName: string; // 고양이 이름 (다온/라온)
  tiles: number[]; // 현재 타일 배치 [0-8]
  tileSources: string[]; // 분할된 타일 이미지 data URL 배열 (9개)
  moveCount: number; // 이동 횟수
  elapsedTime: number; // 소요 시간 (초)

  // 액션
  initGame: () => Promise<void>; // 새 게임 초기화 (이미지 로드 + 셔플)
  clickTile: (index: number) => void; // 타일 클릭 처리
  resetGame: () => void; // 게임 리셋 (메인으로)
  shuffleOnly: () => void; // 같은 이미지로 재셔플
  setElapsedTime: (time: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
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
