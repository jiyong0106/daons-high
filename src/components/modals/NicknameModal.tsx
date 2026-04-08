import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onConfirm: (nickname: string) => void;
}

/**
 * 게임 시작 전 사용자 닉네임을 입력받는 모달 컴포넌트
 */
const NicknameModal = ({ isOpen, onConfirm }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length >= 2 && inputValue.trim().length <= 8) {
      onConfirm(inputValue.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          {/* 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            className="relative w-full max-w-sm bg-(--bg-primary) rounded-3xl p-8 shadow-2xl border-2 border-(--color-accent)"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">✍️</span>
              <h2 className="text-xl font-bold text-(--text-primary)">
                닉네임을 입력해주세요
              </h2>
              <p className="text-sm text-(--text-secondary) mt-1">
                기록을 랭킹에 등록하기 위해 필요해요
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="2~8글자 입력..."
                className="w-full px-4 py-3 bg-(--bg-surface) border-2 border-(--border-color) rounded-xl text-center font-bold text-(--text-primary) focus:outline-none focus:border-(--color-primary) transition-colors"
                maxLength={8}
              />

              <motion.button
                type="submit"
                disabled={inputValue.trim().length < 2 || inputValue.trim().length > 8}
                className="w-full py-3 bg-(--color-primary) text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                시작하기
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NicknameModal;
