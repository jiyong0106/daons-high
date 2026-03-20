/**
 * 3x3 슬라이딩 퍼즐 유틸리티
 * - 풀이 가능한 셔플링 (Fisher-Yates + Inversion Count)
 * - 인접 타일 판단
 * - 완성 판정
 */

const GRID_SIZE = 3;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE; // 9
const EMPTY_TILE = TOTAL_TILES - 1; // 8 (마지막 인덱스가 빈칸)

/**
 * Inversion Count 계산.
 * 빈칸(EMPTY_TILE)을 제외한 타일들의 전도 수를 셈.
 * 3x3 퍼즐에서 빈칸이 마지막 행에 있을 때, inversion이 짝수여야 풀이 가능.
 */
function countInversions(tiles: number[]): number {
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === EMPTY_TILE) continue;
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[j] === EMPTY_TILE) continue;
      if (tiles[i] > tiles[j]) {
        inversions++;
      }
    }
  }
  return inversions;
}

/**
 * 퍼즐이 풀이 가능한지 확인.
 * 3x3에서 빈칸이 마지막 위치(index=8)에 있을 때:
 * → inversion count가 짝수면 solvable
 */
export function isSolvable(tiles: number[]): boolean {
  return countInversions(tiles) % 2 === 0;
}

/**
 * Fisher-Yates 셔플 + 풀이 가능 보정.
 * 1) 0~7 타일을 Fisher-Yates로 셔플
 * 2) inversion count가 홀수면 인접 두 타일 교환 → 짝수로 보정
 * 3) 끝에 빈칸(8) 추가
 * 4) 이미 완성 상태면 다시 셔플
 */
export function generateSolvablePuzzle(): number[] {
  const tiles = Array.from({ length: TOTAL_TILES - 1 }, (_, i) => i); // [0,1,2,3,4,5,6,7]

  // Fisher-Yates Shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // 빈칸을 마지막에 추가 (초기 빈칸 위치: index 8)
  tiles.push(EMPTY_TILE);

  // 풀이 가능 보정: inversion이 홀수면 앞 두 타일(빈칸 아닌) 교환
  if (!isSolvable(tiles)) {
    // 빈칸이 아닌 첫 두 타일을 찾아 교환
    const nonEmptyIndices = tiles
      .map((t, i) => (t !== EMPTY_TILE ? i : -1))
      .filter((i) => i !== -1);
    const [a, b] = [nonEmptyIndices[0], nonEmptyIndices[1]];
    [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
  }

  // 이미 완성 상태인 경우(극히 드묾) 다시 생성
  if (isComplete(tiles)) {
    return generateSolvablePuzzle();
  }

  return tiles;
}

/**
 * 클릭된 타일이 빈칸과 인접한지 판단.
 * 상하좌우로만 이동 가능 (대각선 불가).
 */
export function isAdjacent(clickedIndex: number, emptyIndex: number): boolean {
  const clickedRow = Math.floor(clickedIndex / GRID_SIZE);
  const clickedCol = clickedIndex % GRID_SIZE;
  const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
  const emptyCol = emptyIndex % GRID_SIZE;

  const rowDiff = Math.abs(clickedRow - emptyRow);
  const colDiff = Math.abs(clickedCol - emptyCol);

  // 인접: 행 차이 + 열 차이 = 1 (맨해튼 거리)
  return rowDiff + colDiff === 1;
}

/**
 * 타일 이동 수행. 클릭된 위치와 빈칸 위치의 타일을 교환.
 * 원본 배열을 변경하지 않고 새 배열을 반환.
 */
export function moveTile(tiles: number[], clickedIndex: number): number[] | null {
  const emptyIndex = tiles.indexOf(EMPTY_TILE);

  if (!isAdjacent(clickedIndex, emptyIndex)) {
    return null; // 인접하지 않으면 이동 불가
  }

  const newTiles = [...tiles];
  [newTiles[clickedIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[clickedIndex]];
  return newTiles;
}

/**
 * 퍼즐 완성 판정.
 * 모든 타일이 자기 인덱스에 위치하면 완성.
 */
export function isComplete(tiles: number[]): boolean {
  return tiles.every((tile, index) => tile === index);
}

/**
 * 타일의 행/열 좌표 반환.
 */
export function getPosition(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  };
}

export { GRID_SIZE, TOTAL_TILES, EMPTY_TILE };
