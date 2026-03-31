import { motion } from "framer-motion";

/**
 * 메인 페이지 배경에서 떠다니는 고양이 이모지 장식 컴포넌트
 */
const FloatingEmojis = () => {
  const emojis = ["🐱", "🐾", "✨", "🎴", "🧧", "😺", "🌟", "🐈"];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {emojis.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl md:text-3xl opacity-20"
          style={{
            left: `${10 + ((i * 12) % 80)}%`,
            top: `${15 + ((i * 17) % 60)}%`,
          }}
          animate={{
            y: [0, -15, 0, 15, 0],
            x: [0, 8, 0, -8, 0],
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
};

export default FloatingEmojis;
