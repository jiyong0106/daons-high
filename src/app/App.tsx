import { useEffect } from "react";
import QueryProvider from "@/app/QueryProvider";
import { AnimatePresence } from "framer-motion";
import Router from "@/app/router";
import useGameStore from "@/store/useGameStore";

export default function App() {
  const initAuth = useGameStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <QueryProvider>
      <AnimatePresence mode="wait">
        <Router />
      </AnimatePresence>
    </QueryProvider>
  );
}
