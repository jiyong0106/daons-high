import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
}

/**
 * 공통 Layout 래퍼 컴포넌트
 * - 앱 전체 레이아웃 및 배경 데코레이션 처리
 */
const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-svh bg-(--bg-primary) flex flex-col relative overflow-hidden">
      {/* 배경 장식 - 부적 느낌의 패턴 */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-(--color-primary) rounded-full" />
        <div className="absolute top-20 right-20 w-24 h-24 border border-(--color-accent) rotate-45" />
        <div className="absolute bottom-40 left-1/4 w-16 h-16 border border-(--color-primary) rotate-12" />
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border-2 border-(--color-accent) rounded-full" />
      </div>

      <motion.main
        className="flex-1 flex flex-col relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
