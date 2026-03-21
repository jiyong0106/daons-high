import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainPage from "./pages/MainPage";
import PuzzlePage from "./pages/PuzzlePage";
import ResultPage from "./pages/ResultPage";
import QueryProvider from "./utils/QueryProvider";

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/puzzle" element={<PuzzlePage />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </QueryProvider>
  );
}
