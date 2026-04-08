import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface RankingEntry {
  id?: string; // Firestore에서는 문서 ID를 사용 (문자열)
  user_id: string;
  nickname: string;
  score_time: number;
  move_count: number;
  cat_name: string;
  grid_size: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * 전역 랭킹 상위 10개 가져오기 (난이도별)
 */
export const getGlobalRankings = async (
  sortBy: "score_time" | "move_count" = "score_time",
  gridSize: number = 3,
): Promise<RankingEntry[]> => {
  const secondarySort = sortBy === "score_time" ? "move_count" : "score_time";

  try {
    const rankingsRef = collection(db, "rankings");
    const q = query(
      rankingsRef,
      where("grid_size", "==", gridSize),
      orderBy(sortBy, "asc"),
      orderBy(secondarySort, "asc"),
      limit(10),
    );

    const querySnapshot = await getDocs(q);
    const rankings: RankingEntry[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      rankings.push({
        id: doc.id,
        user_id: data.user_id,
        nickname: data.nickname,
        score_time: data.score_time,
        move_count: data.move_count,
        cat_name: data.cat_name,
        grid_size: data.grid_size,
        created_at: data.created_at?.toDate
          ? data.created_at.toDate().toISOString()
          : data.created_at,
        updated_at: data.updated_at?.toDate
          ? data.updated_at.toDate().toISOString()
          : data.updated_at,
      });
    });

    return rankings;
  } catch (error) {
    console.error(`[${gridSize}x${gridSize}] 랭킹 조회 실패:`, error);
    return [];
  }
};

/**
 * 자신의 난이도별 기존 최고 기록 가져오기
 */
export const getUserBestScore = async (
  userId: string,
  gridSize: number,
): Promise<RankingEntry | null> => {
  try {
    const docId = `${userId}_${gridSize}`;
    const docRef = doc(db, "rankings", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        user_id: data.user_id,
        nickname: data.nickname,
        score_time: data.score_time,
        move_count: data.move_count,
        cat_name: data.cat_name,
        grid_size: data.grid_size,
        created_at: data.created_at?.toDate
          ? data.created_at.toDate().toISOString()
          : data.created_at,
        updated_at: data.updated_at?.toDate
          ? data.updated_at.toDate().toISOString()
          : data.updated_at,
      } as RankingEntry;
    }
  } catch (error) {
    console.error(`[${gridSize}x${gridSize}] 사용자 기록 조회 실패:`, error);
  }

  return null;
};

/**
 * 새로운 기록 등록 (난이도별 내 최고 기록보다 좋을 때만 업서트)
 */
export const addOrUpdateRanking = async (
  entry: RankingEntry,
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

  // 3. Firestore Set (문서 ID 전략: user_id + grid_size)
  try {
    const docId = `${entry.user_id}_${entry.grid_size}`;
    const docRef = doc(db, "rankings", docId);

    await setDoc(
      docRef,
      {
        user_id: entry.user_id,
        nickname: entry.nickname,
        score_time: entry.score_time,
        move_count: entry.move_count,
        cat_name: entry.cat_name,
        grid_size: entry.grid_size,
        created_at: existing ? existing.created_at : serverTimestamp(), // 신규일 때만 생성 시간 저장
        updated_at: serverTimestamp(),
      },
      { merge: true },
    );

    return true;
  } catch (error) {
    console.error(
      `[${entry.grid_size}x${entry.grid_size}] 랭킹 등록 실패:`,
      error,
    );
    return false;
  }
};
