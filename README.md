# 🐾 다온스하이 (Daon's High)

### "귀여운 냥 자랑하는 슬라이스 퍼즐"
**다온스하이**는 사랑스러운 고양이 사진을 활용한 슬라이스 퍼즐 게임입니다.  
고양이들의 귀여움을 감상하세요

[👉 서비스 바로가기](https://daons-high.vercel.app/)

---

## 📸 Screenshots

| 메인 화면 | 게임 플레이 | 랭킹 및 결과 |
| :---: | :---: | :---: |
| ![메인 화면](https://github.com/user-attachments/assets/e9870ef4-2e24-496a-871f-8ddfdf561d55) | ![게임 플레이](https://github.com/user-attachments/assets/a144cef1-de22-4ac0-b4bc-719815f6e653) | ![랭킹 결과](https://github.com/user-attachments/assets/490efd64-20c9-44f1-bfd0-a01352e389d7) |

---

## ✨ 주요 기능

- 🧩 **슬라이스 퍼즐**: 난이도별(3x3, 4x4 등) 퍼즐 플레이 지원
- 🏆 **랭킹**: Firebase 기반의 점수(시간/이동 횟수) 기록
- 📱 **PWA 지원**: 앱처럼 설치하여 오프라인에서도 매끄러운 사용자 경험 제공
- 🎨 **모던 UI/UX**: Tailwind CSS 4와 Framer Motion을 활용한 생동감 넘치는 애니메이션
- 📸 **이미지 최적화**: 고해상도 고양이 이미지를 브라우저에 최적화된 형태로 제공

## 🛠 Tech Stack

| Category | technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite |
| **State** | Zustand, React Query |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **Backend** | Firebase (Firestore/Auth) |
| **Tools** | ESLint, PWA, Sharp (Image Optimization) |


---

## 🏗 Project Structure

- `src/api`: Firebase/Supabase 기반 데이터 통신
- `src/store`: Zustand를 활용한 전역 상태 관리 (Game, Auth 등)
- `src/components`: 재사용 가능한 UI 컴포넌트
- `src/pages`: 핵심 비즈니스 로직이 담긴 페이지 (Main, Puzzle, Ranking)
- `src/lib`: 외부 라이브러리 설정 (Firebase 등)

---
