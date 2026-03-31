---
name: daons-high-dev-standard
description: daons-high 프로젝트(연애 다이어리) 전용 풀스택 개발 컨벤션입니다. react, NativeWind, Zustand 기반의 아키텍처 규칙을 적용합니다.
---

# 🧠 daons-high 프로젝트 개발 컨벤션

당신은 daons-high 프로젝트의 풀스택 개발자로서 아래 규칙을 예외 없이 준수하여 코드를 생성해야 합니다.

## 📁 1. 폴더 구조 및 경로 규칙

모든 파일 생성 및 import 시 아래 구조를 엄격히 따릅니다.

- `pages/`: 페이지 (tabs: main, puzzle, ranking, setting)
- `components/`: UI 컴포넌트 (도메인별: common, main, puzzle, ranking, setting)
- `api/`: API 호출 함수
- `hooks/`: 커스텀 훅
- `store/`: Zustand 스토어 (`use[Name]Store.ts`)
- `types/`: TypeScript 타입 정의
- `lib/`: 프로바이더 및 설정
- `utils/`: 공통 유틸리티

## 📂 2. 명명 규칙 (Naming Convention)

- **폴더명:** `kebab-case` (예: `product-editor`)
- **컴포넌트:** `PascalCase.tsx` (예: `PaymentButton.tsx`)
- **일반 로직/훅:** `camelCase.ts` (예: `useAuth.ts`)

## 🧩 3. TypeScript & 컴포넌트 작성 규칙

- **함수 표현식**만 사용하며, `export default`로 내보냅니다.
- **Props 정의:** 반드시 `interface`로 명시하며 파일 상단에 위치시킵니다.
- **금지 사항:** `React.FC` 사용을 엄격히 금지합니다.
- **예시:**

  ```typescript
  interface Props {
    title: string;
    onPress: () => void;
  }

  const CustomButton = ({ title, onPress }: Props) => {
    return <TouchableOpacity onPress={onPress}>...</TouchableOpacity>;
  };

  export default CustomButton;

  ```

## 🎨 4. 스타일 가이드 (NativeWind)

- **기본:** `Tailwind CSS`를 사용하여 스타일을 선언합니다.
- **결합:** 복잡한 조건부 스타일은 `clsx`를 사용하여 결합합니다.
  - **패턴:** `className={clsx('base-class', condition && 'conditional-class')}`
- **디자인 시스템:**
  - 앱의 감성을 위해 도트 디자인을 지향합니다.
- **레이아웃:** Flexbox 기반의 모바일 최적화 레이아웃을 지향합니다.

## 🛠 5. API 및 상태 관리

- **Data Fetching:** 데이터 패칭시`@tanstack/react-query`를 사용하며, 로딩/에러 상태를 명시적으로 분리하여 처리합니다.
- **Global State:** `Zustand`를 사용하며, 파일명은 `use[Name]Store.ts` 형식을 엄격히 유지합니다.

## 📌 6. 개발 및 심화 원칙

- **단일 책임 원칙 (SRP) 및 관심사 분리:**
  - 하나의 컴포넌트는 오직 **하나의 명확한 기능**만 담당하며, 컴포넌트 내부에 비즈니스 로직과 UI 구조를 혼재시키지 않습니다.
  - **로직 추출:** 데이터 가공이나 복잡한 상태 관리 로직은 반드시 커스텀 훅(`hooks/`)으로 분리하여 UI 컴포넌트의 가독성을 높입니다.
  - **컴포넌트 분할:** 단일 파일이 너무 비대해지지 않도록 주의하며, 내부 UI 요소가 비대해질 경우 별도의 하위 컴포넌트(Sub-components)로 과감히 분리합니다.
- **재사용성 및 모듈화:**
  - 2회 이상 반복되는 UI 패턴은 `components/common/` 또는 도메인별 공통 컴포넌트로 즉시 추출하여 중복 코드를 방지합니다.
  - 가능한 한 순수 함수(Pure Function)로 로직을 작성하여 테스트와 재사용이 용이하게 설계합니다.
- **공통 로직 및 유틸함수 분리:**
  - **유틸리티 모듈화:** 날짜 형식 변환(Format), 시간 계산, 통화 표기 등 여러 곳에서 공용으로 사용될 로직은 반드시 `utils/` 폴더에 별도의 파일로 분리합니다.
  - **포맷터 전용 파일:** 특히 날짜와 시간 관련등 가공과 관련된 함수는 **`utils/formatter.ts`** 파일에 집중시켜 프로젝트 전체의 출력 형식을 일관되게 관리합니다.
  - **순수 함수 지향:** 유틸함수는 외부 상태에 의존하지 않는 순수 함수(Pure Function)로 작성하여 어디서든 안전하게 재사용할 수 있도록 설계합니다.- **가독성 우선:** 과도한 추상화나 복잡한 고도화보다는 동료 개발자가 이해하기 쉬운 직관적인 코드를 작성합니다.
- **UX 최적화:**
  - 이미지 캐싱, 지도 클러스터링 등 모바일 환경에서의 성능 최적화를 최우선으로 고려합니다.
  - 클릭, 입력 등 모든 사용자 인터랙션에는 즉각적인 시각적 피드백(Haptic, Opacity 변화 등)을 제공해야 합니다.

## 🗄️ 7. 데이터 모킹 (Mockup) 및 관리 규칙

이 규칙은 목업 데이터가 실제 API 응답과 100% 동일하게 작동하도록 보장하며, 향후 Supabase로의 전환 및 데이터 이관(Migration) 효율을 극대화합니다.

### 📁 파일 형식 및 경로

- **경로 규칙:** 반드시 **`utils/mock/`** 폴더 내에 위치시켜야 합니다.
- **엄격한 준수:** - 모든 키(Key)와 문자열 값은 반드시 **큰따옴표(`"`)**를 사용합니다.
  - 마지막 요소 뒤의 쉼표(Trailing comma)나 파일 내 주석을 절대 포함하지 않습니다.

### 🛢️ Supabase 호환 스키마 (Future-Proof)

- **컬럼 네이밍 (Snake Case):** 모든 키는 DB 컬럼명과 동일하게 **`snake_case`**를 사용합니다. (예: `user_id`, `is_completed`)
- **식별자 (UUID):** `id`, `user_id`, `couple_id` 등 모든 기본키(PK) 및 외래키(FK)는 **UUID** 형식을 따릅니다.
- **날짜 (ISO 8601):** 시간 데이터는 `"2026-03-23T10:00:00Z"`와 같은 **ISO 8601 표준 문자열** 형식을 사용합니다.

### 🛠️ 구현 가이드 (Implementation)

1. 해당 데이터의 TypeScript Interface를 **`types/`** 폴더 내 도메인별 파일로 정의합니다.
2. **타입 명명 규칙:** 반드시 **`[파일명]Type`** 형식을 사용합니다. (예: `CalendarEventType`, `UserType`)

**✅ 예시 (에이전트 출력 형태):**

```typescript
// types/calendar.ts
export interface CalendarEventType {
  id: string;
}


## ⚠️ 출력 제한 사항
- **컨벤션 준수:** 위에서 정의한 모든 규칙을 어기는 코드는 절대 생성하지 않습니다. (특히 **PHP 관련 제안은 엄격히 금지**하며, 오직 React/Next.js/Expo 환경에 집중합니다.)
- **명시적 가이드:** 코드 생성 시, 해당 파일이 위치해야 할 **정확한 폴더 경로와 파일명**을 코드 블록 상단에 반드시 명시합니다.
```
