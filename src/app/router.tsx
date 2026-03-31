import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GamesPage, MainPage, PuzzlePage, ResultPage } from "@/pages";

/**
 * 전역 라우팅 설정
 * / : 메인 페이지
 * /games : 게임 목록 페이지
 * /games/puzzle/:gameId : 개별 퍼즐 게임 페이지 (동적)
 * /result : 결과 확인 페이지
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/games",
    element: <GamesPage />,
  },
  {
    path: "/games/puzzle/:gameId",
    element: <PuzzlePage />,
  },
  {
    path: "/result",
    element: <ResultPage />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
