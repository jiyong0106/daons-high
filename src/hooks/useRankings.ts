import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGlobalRankings, addOrUpdateRanking, type RankingEntry } from "../api/rankingService";

export const rankingKeys = {
  all: ["rankings"] as const,
  lists: () => [...rankingKeys.all, "list"] as const,
  list: (sortBy: string) => [...rankingKeys.lists(), sortBy] as const,
};

/**
 * 전역 랭킹 데이터를 가져오는 커스텀 훅
 */
export const useGetRankings = (sortBy: "score_time" | "move_count") => {
  return useQuery({
    queryKey: rankingKeys.list(sortBy),
    queryFn: () => getGlobalRankings(sortBy),
    staleTime: 1000 * 60, // 1분간 캐시 유지
  });
};

/**
 * 새로운 게임 기록을 등록하거나 업데이트하는 커스텀 훅
 */
export const useAddRanking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: RankingEntry) => addOrUpdateRanking(entry),
    onSuccess: (isBetter) => {
      // 신규 기록이거나 기존 기록 경신 시에만 랭킹 목록 무효화
      if (isBetter) {
        queryClient.invalidateQueries({ queryKey: rankingKeys.all });
      }
    },
  });
};
