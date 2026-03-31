import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGlobalRankings, addOrUpdateRanking, type RankingEntry } from "../api/rankingService";

export const rankingKeys = {
  all: ["rankings"] as const,
  lists: () => [...rankingKeys.all, "list"] as const,
  list: (gridSize: number, sortBy: string) =>
    [...rankingKeys.lists(), gridSize, sortBy] as const,
};

/**
 * 전역 랭킹 데이터를 가져오는 커스텀 훅 (난이도별)
 */
export const useGetRankings = (
  gridSize: number,
  sortBy: "score_time" | "move_count"
) => {
  return useQuery({
    queryKey: rankingKeys.list(gridSize, sortBy),
    queryFn: () => getGlobalRankings(sortBy, gridSize),
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
