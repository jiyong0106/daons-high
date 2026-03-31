/**
 * 게임 관련 핵심 타입 정의
 * 컨벤션: [파일명]Type 형식을 사용
 */

export type GameStatusType = "idle" | "loading" | "playing" | "completed";

export interface GameStateType {
  // 사용자 정보
  userId: string;
  userName: string | null;
  setUserName: (name: string) => void;

  // 게임 상태
  gameStatus: GameStatusType;
  selectedImage: string | null;
  catName: string;
  tiles: number[];
  tileSources: string[];
  moveCount: number;
  elapsedTime: number;

  // 액션
  initGame: () => Promise<void>;
  clickTile: (index: number) => void;
  resetGame: () => void;
  shuffleOnly: () => void;
  setElapsedTime: (time: number) => void;
}
