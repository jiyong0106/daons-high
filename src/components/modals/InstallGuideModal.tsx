import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PWA 설치(홈 화면 추가) 방법을 안내하는 모달 컴포넌트
 */
const InstallGuideModal = ({ isOpen, onClose }: Props) => {
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
            onClick={onClose}
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            className="relative w-full max-w-sm bg-(--bg-primary) rounded-3xl p-6 shadow-2xl border-2 border-(--color-accent) overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">📱</span>
              <h2 className="text-xl font-bold text-(--text-primary)">
                홈 화면에 추가하기
              </h2>
              <p className="text-sm text-(--text-secondary) mt-1">
                앱처럼 바로 접속하고 더 편하게 즐겨보세요
              </p>
            </div>

            <div className="space-y-4 py-4 border-y border-(--border-color)">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <p className="text-sm text-(--text-primary)">
                  브라우저 하단의 <b>공유 버튼</b>을 누르세요.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <p className="text-sm text-(--text-primary)">
                  스크롤을 내려 <b>'홈 화면에 추가'</b>를 선택하세요.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <p className="text-sm text-(--text-primary)">
                  우측 상단의 <b>'추가'</b>를 누르면 설치가 완료됩니다!
                </p>
              </div>
            </div>

            <motion.button
              onClick={onClose}
              className="w-full py-3 mt-6 bg-(--color-primary) text-white rounded-xl font-bold shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              알겠어요!
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InstallGuideModal;
