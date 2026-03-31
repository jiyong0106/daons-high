/**
 * 3x3 슬라이딩 퍼즐 유틸리티
 * - 풀이 가능한 셔플링 (Fisher-Yates + Inversion Count)
 * - 인접 타일 판단
 * - 완성 판정
 */

/**
 * 슬라이딩 퍼즐 범용 유틸리티
 * - 동적 그리드 크기(3x3, 4x4 등) 지원
 * - 풀이 가능한 셔플링 (Fisher-Yates + Inversion Count)
 */

export const getEmptyTile = (gridSize: number) => gridSize * gridSize - 1;

/**
 * Inversion Count 계산.
 * 빈칸을 제외한 타일들의 전도 수를 셈.
 */
function countInversions(tiles: number[], emptyTileValue: number): number {
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === emptyTileValue) continue;
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[j] === emptyTileValue) continue;
      if (tiles[i] > tiles[j]) {
        inversions++;
      }
    }
  }
  return inversions;
}

/**
 * 퍼즐이 풀이 가능한지 확인.
 * - 그리드가 홀수(3x3)일 때: inversion count가 짝수여야 함.
 * - 그리드가 짝수(4x4)일 때: (inversion + 빈칸의 행 위치(밑에서부터))의 합이 짝수여야 함.
 */
export function isSolvable(tiles: number[], gridSize: number): boolean {
  const emptyTileValue = getEmptyTile(gridSize);
  const inversions = countInversions(tiles, emptyTileValue);

  if (gridSize % 2 !== 0) {
    // 홀수 그리드 (3x3 등)
    return inversions % 2 === 0;
  } else {
    // 짝수 그리드 (4x4 등)
    const emptyIndex = tiles.indexOf(emptyTileValue);
    const emptyRowFromBottom = gridSize - Math.floor(emptyIndex / gridSize);
    // 짝수 그리드에서는 (inversions + 빈칸행)의 홀짝이 일치해야 함
    return (inversions + emptyRowFromBottom) % 2 !== 0;
  }
}

/**
 * Fisher-Yates 셔플 + 풀이 가능 보정.
 */
export function generateSolvablePuzzle(gridSize: number): number[] {
  const totalTiles = gridSize * gridSize;
  const emptyTileValue = getEmptyTile(gridSize);
  const tiles = Array.from({ length: totalTiles - 1 }, (_, i) => i); // [0, ..., n-2]

  // Fisher-Yates Shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // 빈칸 추가 (초기 위치: 마지막)
  tiles.push(emptyTileValue);

  // 풀이 가능 보정: solvable하지 않으면 인접한 두 타일(빈칸 아닌) 교환
  if (!isSolvable(tiles, gridSize)) {
    const nonEmptyIndices = tiles
      .map((t, i) => (t !== emptyTileValue ? i : -1))
      .filter((i) => i !== -1);
    const [a, b] = [nonEmptyIndices[0], nonEmptyIndices[1]];
    [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
  }

  // 이미 완성 상태인 경우 다시 생성
  if (isComplete(tiles)) {
    return generateSolvablePuzzle(gridSize);
  }

  return tiles;
}

/**
 * 클릭된 타일이 빈칸과 인접한지 판단.
 */
export function isAdjacent(
  clickedIndex: number,
  emptyIndex: number,
  gridSize: number,
): boolean {
  const clickedRow = Math.floor(clickedIndex / gridSize);
  const clickedCol = clickedIndex % gridSize;
  const emptyRow = Math.floor(emptyIndex / gridSize);
  const emptyCol = emptyIndex % gridSize;

  const rowDiff = Math.abs(clickedRow - emptyRow);
  const colDiff = Math.abs(clickedCol - emptyCol);

  return rowDiff + colDiff === 1;
}

/**
 * 타일 이동 수행.
 */
export function moveTile(
  tiles: number[],
  clickedIndex: number,
  gridSize: number,
): number[] | null {
  const emptyTileValue = getEmptyTile(gridSize);
  const emptyIndex = tiles.indexOf(emptyTileValue);

  if (!isAdjacent(clickedIndex, emptyIndex, gridSize)) {
    return null;
  }

  const newTiles = [...tiles];
  [newTiles[clickedIndex], newTiles[emptyIndex]] = [
    newTiles[emptyIndex],
    newTiles[clickedIndex],
  ];
  return newTiles;
}

/**
 * 퍼즐 완성 판정.
 */
export function isComplete(tiles: number[]): boolean {
  return tiles.every((tile, index) => tile === index);
}

/**
 * 타일의 행/열 좌표 반환.
 */
export function getPosition(index: number, gridSize: number): { row: number; col: number } {
  return {
    row: Math.floor(index / gridSize),
    col: index % gridSize,
  };
}
