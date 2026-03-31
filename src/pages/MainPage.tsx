import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import Layout from "../components/layout/Layout";
import NicknameModal from "../components/modals/NicknameModal";
import RankingModal from "../components/modals/RankingModal";
import InstallGuideModal from "../components/modals/InstallGuideModal";
import FloatingEmojis from "../components/main/FloatingEmojis";
import TypingText from "../components/main/TypingText";
import MainHero from "../components/main/MainHero";
import MainCTA from "../components/main/MainCTA";
import MainFooter from "../components/main/MainFooter";
import { MAIN_MESSAGES } from "../constants/messages";

/**
 * 앱의 진입점인 메인 페이지 컴포넌트
 * - UI 정적 섹션들을 서브 컴포넌트로 위함하여 가독성 강화
 */
const MainPage = () => {
  const navigate = useNavigate();
  const { userName, setUserName, initGame } = useGameStore();
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);

  // 퍼즐 시작 버튼 핸들러
  const handleStartPuzzle = async () => {
    if (!userName) {
      setIsNicknameModalOpen(true);
      return;
    }
    await initGame();
    navigate("/games");
  };

  // 닉네임 확인 핸들러
  const handleNicknameConfirm = async (nickname: string) => {
    setUserName(nickname);
    setIsNicknameModalOpen(false);
    await initGame();
    navigate("/puzzle");
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-start gap-1 px-4 py-8 relative">
        {/* 애니메이션 배경 효과 */}
        <FloatingEmojis />
        <TypingText text={MAIN_MESSAGES.DESCRIPTION} />

        {/* 상단 섹션 (로고, 타이틀) */}
        <MainHero />

        {/* 핵심 행동 유도 섹션 (시작 버튼, GIF) */}
        <MainCTA onStart={handleStartPuzzle} />

        {/* 하단 액션 섹션 (랭킹, 설치 안내) */}
        <MainFooter
          onShowRanking={() => setIsRankingModalOpen(true)}
          onShowInstallGuide={() => setIsInstallGuideOpen(true)}
        />
      </div>

      {/* 모달 관리 영역 */}
      <NicknameModal
        isOpen={isNicknameModalOpen}
        onConfirm={handleNicknameConfirm}
      />
      {isRankingModalOpen && (
        <RankingModal
          isOpen={isRankingModalOpen}
          onClose={() => setIsRankingModalOpen(false)}
        />
      )}
      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />
    </Layout>
  );
};

export default MainPage;
