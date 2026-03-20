import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainPage from "./pages/MainPage";
import PuzzlePage from "./pages/PuzzlePage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/puzzle" element={<PuzzlePage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
