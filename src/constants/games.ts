import type { GameMetadataType } from "@/types/game";

/**
 * 프로젝트 내에서 제공하는 모든 게임 리스트 관리
 * - 새로운 게임(난이도 포함) 추가 시 이곳에 데이터만 추가하면 됨
 */
export const GAMES: GameMetadataType[] = [
  {
    id: "puzzle-3x3",
    type: "puzzle",
    title: "초급 퍼즐",
    description:
      "3x3 그리드에서 다온이와 라온이를 만나보세요. 입문자에게 추천합니다!",
    gridSize: 3,
    difficulty: "Easy",
    icon: "🧩",
  },
  {
    id: "puzzle-4x4",
    type: "puzzle",
    title: "중급 퍼즐",
    description:
      "4x4 그리드에서 더 복잡해진 퍼즐에 도전해보세요. 전략적인 이동이 필요합니다.",
    gridSize: 4,
    difficulty: "Normal",
    icon: "⭐",
  },
  {
    id: "puzzle-5x5",
    type: "puzzle",
    title: "고급 퍼즐",
    description:
      "5x5 그리드! 고도의 집중력이 필요합니다. 진정한 퍼즐 마스터를 위한 단계입니다.",
    gridSize: 5,
    difficulty: "Hard",
    icon: "🔥",
  },
];
