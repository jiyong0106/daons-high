import { motion } from "framer-motion";

interface Props {
  text: string;
}

/**
 * 텍스트가 한 글자씩 나타나는 타이핑 효과 컴포넌트
 */
const TypingText = ({ text }: Props) => {
  return (
    <motion.p
      className="text-xs text-center leading-relaxed text-(--text-secondary) opacity-80 max-w-xs md:max-w-md"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.03, delayChildren: 0.5 } },
      }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default TypingText;
