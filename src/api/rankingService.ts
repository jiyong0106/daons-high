import { supabase } from "../utils/supabase";

export interface RankingEntry {
  id?: number;
  user_id: string;
  nickname: string;
  score_time: number;
  move_count: number;
  cat_name: string;
  grid_size: number; // 보드 크기 (3, 4, 5)
  created_at?: string;
}

/**
 * 전역 랭킹 상위 10개 가져오기 (난이도별)
 * @param sortBy 정렬 기준 ("score_time" | "move_count")
 * @param gridSize 보드 크기 (3, 4, 5)
 */
export const getGlobalRankings = async (
  sortBy: "score_time" | "move_count" = "score_time",
  gridSize: number = 3
): Promise<RankingEntry[]> => {
  const secondarySort = sortBy === "score_time" ? "move_count" : "score_time";

  const { data, error } = await supabase
    .from("rankings")
    .select("*")
    .eq("grid_size", gridSize) // 난이도 필터 추가
    .order(sortBy, { ascending: true })
    .order(secondarySort, { ascending: true })
    .limit(10);

  if (error) {
    console.error(`[${gridSize}x${gridSize}] 랭킹 조회 실패:`, error);
    return [];
  }

  return data || [];
};

/**
 * 자신의 난이도별 기존 최고 기록 가져오기
 */
export const getUserBestScore = async (
  userId: string,
  gridSize: number
): Promise<RankingEntry | null> => {
  const { data, error } = await supabase
    .from("rankings")
    .select("*")
    .eq("user_id", userId)
    .eq("grid_size", gridSize)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116: 결과 없음
    console.error(`[${gridSize}x${gridSize}] 사용자 기록 조회 실패:`, error);
  }

  return data || null;
};

/**
 * 새로운 기록 등록 (난이도별 내 최고 기록보다 좋을 때만 업서트)
 */
export const addOrUpdateRanking = async (
  entry: RankingEntry
): Promise<boolean> => {
  // 1. 해당 난이도의 기존 기록 확인
  const existing = await getUserBestScore(entry.user_id, entry.grid_size);

  // 2. 기록 경신 여부 확인
  const isBetter =
    !existing ||
    entry.score_time < existing.score_time ||
    (entry.score_time === existing.score_time &&
      entry.move_count < existing.move_count);

  if (!isBetter) return false;

  // 3. Upsert 실행
  // (유의: DB 테이블에서 user_id와 grid_size 기반의 복합 유니크 제약/인덱스가 필요함)
  const { error } = await supabase.from("rankings").upsert(
    {
      user_id: entry.user_id,
      nickname: entry.nickname,
      score_time: entry.score_time,
      move_count: entry.move_count,
      cat_name: entry.cat_name,
      grid_size: entry.grid_size,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,grid_size", // DB 제약 조건에 따라 수정될 수 있음
    }
  );

  if (error) {
    console.error(`[${entry.grid_size}x${entry.grid_size}] 랭킹 등록 실패:`, error);
    return false;
  }

  return true;
};
