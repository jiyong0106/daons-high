import { AnimatePresence } from "framer-motion";
import QueryProvider from "./QueryProvider";
import Router from "./router";

export default function App() {
  return (
    <QueryProvider>
      <AnimatePresence mode="wait">
        <Router />
      </AnimatePresence>
    </QueryProvider>
  );
}
