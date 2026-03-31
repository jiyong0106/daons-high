/**
 * 데이터 포맷팅 관련 유틸리티 함수 모음
 * - 날짜, 시간, 통화 등 가공 로직 집중 관리
 */

/**
 * 초(seconds)를 MM : SS 형식의 문자열로 변환합니다.
 * @param seconds 경과 시간(초)
 * @returns 포맷팅된 시간 문자열
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
};

/**
 * ISO 8601 날짜 문자열을 읽기 쉬운 형식으로 변환합니다. (예시용)
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
