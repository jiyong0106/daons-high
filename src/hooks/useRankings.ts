import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGlobalRankings, addOrUpdateRanking, type RankingEntry } from "../api/rankingService";

export const rankingKeys = {
  all: ["rankings"] as const,
  lists: () => [...rankingKeys.all, "list"] as const,
  list: (sortBy: string) => [...rankingKeys.lists(), sortBy] as const,
};

/**
 * 전역 랭킹 가져오기 훅
 */
export function useGetRankings(sortBy: "score_time" | "move_count") {
  return useQuery({
    queryKey: rankingKeys.list(sortBy),
    queryFn: () => getGlobalRankings(sortBy),
    staleTime: 1000 * 60, // 1분간 신선한 상태 유지
  });
}

/**
 * 새로운 기록 등록 훅
 */
export function useAddRanking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: RankingEntry) => addOrUpdateRanking(entry),
    onSuccess: (isBetter) => {
      // 기록이 경신되었을 때만 랭킹 목록 무효화 (다시 불러오기)
      if (isBetter) {
        queryClient.invalidateQueries({ queryKey: rankingKeys.all });
      }
    },
  });
}
