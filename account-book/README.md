# 💰 Account Book with OCR — 프론트엔드 실습 프로젝트

React + Vite 기반의 가계부 앱입니다.
백엔드 API 연동 실습을 위한 완성 코드입니다.

## 기술 스택

| 역할 | 기술 |
|------|------|
| 프레임워크 | React 18 + Vite |
| 스타일 | Tailwind CSS v3 |
| 라우팅 | React Router v6 |
| 서버 상태 | TanStack React Query v5 |
| 전역 상태 | Redux Toolkit (인증) + Zustand (UI) |
| HTTP 클라이언트 | Axios |

## 프로젝트 구조

```
src/
├── api/                  # API 함수 (axios 호출만 담당)
│   ├── axios.js          # axios 인스턴스 + 인터셉터
│   ├── auth.js           # 인증 API
│   ├── user.js           # 사용자 API
│   ├── ledger.js         # 가계부 API
│   └── admin.js          # 관리자 API
│
├── store/                # 전역 상태 관리
│   ├── index.js          # Redux 스토어
│   ├── slices/
│   │   └── authSlice.js  # 인증 Redux slice
│   └── uiStore.js        # Zustand (모달 상태)
│
├── hooks/                # React Query 커스텀 훅
│   ├── useLedger.js      # 가계부 관련 훅
│   └── useUser.js        # 사용자 관련 훅
│
├── components/
│   ├── common/
│   │   ├── PrivateRoute.jsx   # 인증 보호 라우트
│   │   └── LedgerModal.jsx    # 가계부 생성/수정 모달
│   └── layout/
│       └── Navbar.jsx         # 상단 네비게이션
│
├── pages/
│   ├── LoginPage.jsx         # 로그인
│   ├── LedgerListPage.jsx    # 가계부 목록
│   ├── ComparePage.jsx       # 전국 평균 비교
│   ├── ProfilePage.jsx       # 내 정보
│   └── AdminPage.jsx         # 관리자 패널
│
└── utils/
    └── format.js             # 포맷 유틸 함수
```

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정 (.env 파일 수정)
# VITE_API_BASE_URL=http://localhost:8080

# 3. 개발 서버 시작
npm run dev
```

## 환경 변수

`.env` 파일을 프로젝트 루트에 만들고 아래 내용을 작성합니다.

```
VITE_API_BASE_URL=http://localhost:8080
```

## 실습 가이드

### 실습 1 — GET 요청: 가계부 목록 조회
파일: `src/hooks/useLedger.js` → `useLedgers` 훅
API: `GET /api/v1/ledgers?page=0&size=10`

### 실습 2 — POST 요청: 가계부 내역 생성
파일: `src/hooks/useLedger.js` → `useCreateLedger` 훅
API: `POST /api/v1/ledgers`

### 실습 3 — GET 요청: 내 정보 조회
파일: `src/hooks/useUser.js` → `useMe` 훅
API: `GET /api/v1/users/me`

### 실습 4 — PUT 요청: 내 정보 수정
파일: `src/hooks/useUser.js` → `useUpdateMe` 훅
API: `PUT /api/v1/users/me`

## 주요 개념 정리

### Redux vs Zustand 언제 쓰나요?
- **Redux**: 앱 전체에서 중요한 데이터 (로그인 여부, 유저 정보)
- **Zustand**: 특정 컴포넌트군의 가벼운 UI 상태 (모달 열림/닫힘)

### React Query는 왜 쓰나요?
서버에서 받아오는 데이터(목록, 상세 등)는 "서버 상태"입니다.
React Query는 이 서버 상태를 자동으로 캐싱하고, 필요할 때 재조회해 줍니다.
- `useQuery` → 데이터 조회 (GET)
- `useMutation` → 데이터 변경 (POST, PUT, DELETE)
- `queryClient.invalidateQueries` → 변경 후 목록 자동 갱신
