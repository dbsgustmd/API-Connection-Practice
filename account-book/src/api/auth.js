// src/api/auth.js
// 인증 관련 API 함수들을 모아둔 파일입니다.

import api from "./axios";

// 토큰 재발급 (refresh_token 쿠키를 이용)
export const refreshToken = () => api.post("/api/v1/auth/refresh");
