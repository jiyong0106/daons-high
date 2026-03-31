import { motion } from "framer-motion";
import daonGif from "@/assets/images/redaon.gif";

interface Props {
  onStart: () => void;
}

/**
 * 메인 페이지 행동 유도(CTA) 버튼 섹션
 * - 반짝이는 애니메이션 버튼과 다온이 GIF 포함
 */
const MainCTA = ({ onStart }: Props) => {
  return (
    <motion.div
      className="z-10 relative mt-5"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring" }}
    >
      {/* 시작하기 버튼 */}
      <motion.button
        onClick={onStart}
        className="
           px-12 py-3 
           bg-linear-to-br from-(--color-primary) to-[#A00000]
           text-white text-md tracking-widest
           rounded-2xl shadow-2xl
           cursor-pointer
           relative overflow-hidden
        "
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 20px 40px rgba(200, 0, 0, 0.4)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* 버튼 내 반짝임 효과 */}
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-200%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        <span className="relative">시작하기</span>
      </motion.button>

      {/* 다온이 캐릭터 GIF (버튼 뒤에 배치) */}
      <motion.img
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        src={daonGif}
        alt="메인 캐릭터"
        className="w-40 h-40 md:w-48 md:h-48 object-contain absolute bottom-[-70px] right-[-110px] pointer-events-none"
      />
    </motion.div>
  );
};

export default MainCTA;
