import { motion } from "framer-motion";
import { MAIN_MESSAGES } from "@/constants/messages";

/**
 * 메인 페이지 상단 히어로 섹션
 * - 부적 프레임 애니메이션, 타이틀, 서브타이틀, 안내 문구를 포함
 */
const MainHero = () => {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* 로고 및 타이틀 섹션 */}
      <motion.div
        className="text-center relative z-10"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        {/* 부적 프레임 장식 */}
        <motion.div
          className="p-5 md:p-20 mb-8 relative flex items-center justify-center"
          initial={{ rotate: -5 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div className="absolute inset-0 border-2 border-(--color-primary) rounded-3xl opacity-30 rotate-2" />
          <div className="absolute inset-0 border-2 border-(--color-accent) rounded-3xl opacity-20 -rotate-2" />
          <span className="text-6xl md:text-7xl relative z-10 leading-none">
            🐱
          </span>
        </motion.div>

        {/* 메인 타이틀 */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-(--text-primary) tracking-[0.15em]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {MAIN_MESSAGES.TITLE}
        </motion.h1>

        {/* 서브 타이틀 */}
        <motion.p
          className="text-base md:text-lg text-(--text-secondary) mb-4 tracking-[0.2em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {MAIN_MESSAGES.SUBTITLE}
        </motion.p>

        {/* 행동 유도 안내 */}
        <motion.p
          className="text-sm md:text-base text-(--color-primary) font-medium tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {MAIN_MESSAGES.CTA_GUIDE}
        </motion.p>
      </motion.div>

      {/* 게임 안내 텍스트 */}
      <motion.div
        className="text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex flex-col gap-2 text-xs md:text-sm text-(--text-secondary) opacity-80">
          <p>{MAIN_MESSAGES.PUZZLE_GUIDE}</p>
          <p>{MAIN_MESSAGES.TOTAL_PICS}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default MainHero;
