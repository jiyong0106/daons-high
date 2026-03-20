/**
 * 로컬 스토리지 기반 랭킹 데이터 관리 유틸리티
 */

export interface RankEntry {
  userName: string;
  time: number; // 소요 시간 (초)
  moveCount: number; // 이동 횟수
  date: number; // 타임스탬프
}

const RANK_KEY = "daons_high_rankings";

/**
 * 전역 랭킹 데이터 가져오기 (상위 10개)
 */
export const getRankings = (): RankEntry[] => {
  const data = localStorage.getItem(RANK_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

/**
 * 새로운 기록 등록 (상위 10위 안에 들면 저장)
 */
export const saveRanking = (newEntry: RankEntry): boolean => {
  const currentRankings = getRankings();
  
  // 1. 새로운 목록 생성 및 정렬 (시간 짧은 순 -> 이동 횟수 적은 순)
  const updatedRankings = [...currentRankings, newEntry]
    .sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      return a.moveCount - b.moveCount;
    })
    .slice(0, 10); // 상위 10개만 유지

  // 2. 내 기록이 10위 안에 포함되었는지 확인
  const isIncluded = updatedRankings.some(
    (entry) => entry.date === newEntry.date && entry.userName === newEntry.userName
  );

  if (isIncluded) {
    localStorage.setItem(RANK_KEY, JSON.stringify(updatedRankings));
  }

  return isIncluded;
};

/**
 * 사용자 닉네임 관련
 */
export const getStoredUserName = (): string | null => {
  return localStorage.getItem("daons_high_user_name");
};

export const setStoredUserName = (name: string) => {
  localStorage.setItem("daons_high_user_name", name);
};
