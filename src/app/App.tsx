import QueryProvider from "@/app/QueryProvider";
import { AnimatePresence } from "framer-motion";
import Router from "@/app/router";

export default function App() {
  return (
    <QueryProvider>
      <AnimatePresence mode="wait">
        <Router />
      </AnimatePresence>
    </QueryProvider>
  );
}
