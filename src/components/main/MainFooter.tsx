import { motion } from "framer-motion";
import { usePWAInstall } from "@/hooks/usePWAInstall";

interface Props {
  onShowRanking: () => void;
  onShowInstallGuide: () => void;
}

/**
 * 메인 페이지 하단 액션 버튼 섹션
 * - 명예의 전당 진입 및 PWA 설치 안내 링크 관리
 */
const MainFooter = ({ onShowRanking, onShowInstallGuide }: Props) => {
  const { isInstallable, isStandalone, isIOS, handleInstall } = usePWAInstall();

  const handleInstallClick = () => {
    if (isInstallable) {
      handleInstall();
    } else if (isIOS) {
      onShowInstallGuide();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-12 pb-8">
      {/* 명예의 전당 진입 버튼 */}
      <motion.button
        onClick={onShowRanking}
        className="w-full text-sm text-(--text-secondary) font-medium underline underline-offset-4 opacity-70 cursor-pointer"
        whileHover={{ opacity: 1, scale: 1.05 }}
      >
        🏆 명예의 전당
      </motion.button>

      {/* 모바일 설치 가이드 버튼 (설치 가능한 경우만 노출) */}
      {!isStandalone && (isInstallable || isIOS) && (
        <motion.button
          onClick={handleInstallClick}
          className="w-full text-xs text-(--text-secondary) font-medium underline underline-offset-4 opacity-70 cursor-pointer"
          whileHover={{ opacity: 1, scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
        >
          모바일 설치 방법 확인하기
        </motion.button>
      )}
    </div>
  );
};

export default MainFooter;
