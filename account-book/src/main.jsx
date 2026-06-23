// src/main.jsx
// 앱의 진입점입니다.
// 필요한 Provider들을 여기서 한번에 감쌉니다.
//
// 감싸는 순서:
// 1. Provider (Redux)           → 전역 인증 상태 관리
// 2. QueryClientProvider        → 서버 상태(API) 관리
// 3. BrowserRouter              → URL 라우팅
// 4. App                        → 실제 앱

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./store";
import App from "./App.jsx";
import "./index.css";
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);
// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 창에 포커스될 때 자동 재조회 비활성화 (개발 시 편의를 위해)
      refetchOnWindowFocus: false,
      // 에러 시 재시도 횟수
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
