import { supabase } from "../utils/supabase";

export interface RankingEntry {
  id?: number;
  user_id: string;
  nickname: string;
  score_time: number;
  move_count: number;
  cat_name: string;
  created_at?: string;
}

/**
 * 전역 랭킹 상위 10개 가져오기
 */
export const getGlobalRankings = async (): Promise<RankingEntry[]> => {
  const { data, error } = await supabase
    .from("rankings")
    .select("*")
    .order("score_time", { ascending: true })
    .order("move_count", { ascending: true })
    .limit(10);

  if (error) {
    console.error("랭킹 조회 실패:", error);
    return [];
  }

  return data || [];
};

/**
 * 자신의 기존 최고 기록 가져오기
 */
export const getUserBestScore = async (userId: string): Promise<RankingEntry | null> => {
  const { data, error } = await supabase
    .from("rankings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116: 결과 없음
    console.error("사용자 기록 조회 실패:", error);
  }

  return data || null;
};

/**
 * 새로운 기록 등록 (내 최고 기록보다 좋을 때만 업서트)
 */
export const addOrUpdateRanking = async (entry: RankingEntry): Promise<boolean> => {
  // 1. 기존 기록 확인
  const existing = await getUserBestScore(entry.user_id);

  // 2. 기록 경신 여부 확인 (기존 기록이 없거나, 새 소요시간이 더 짧거나, 시간은 같지만 이동수가 적을 때)
  const isBetter = !existing || 
    entry.score_time < existing.score_time || 
    (entry.score_time === existing.score_time && entry.move_count < existing.move_count);

  if (!isBetter) return false;

  // 3. Upsert 실행
  const { error } = await supabase
    .from("rankings")
    .upsert({
      user_id: entry.user_id,
      nickname: entry.nickname,
      score_time: entry.score_time,
      move_count: entry.move_count,
      cat_name: entry.cat_name,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "user_id"
    });

  if (error) {
    console.error("랭킹 등록 실패:", error);
    return false;
  }

  return true;
};
