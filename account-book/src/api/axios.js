// src/api/axios.js
// axios 인스턴스를 설정하는 파일입니다.
// 모든 API 요청은 이 인스턴스를 통해 이루어집니다.

import axios from "axios";
console.log("baseURL:", import.meta.env.VITE_API_BASE_URL);
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 쿠키(refresh_token)를 자동으로 포함하기 위해 필요
});

// 요청 인터셉터: 모든 요청에 JWT 토큰을 자동으로 첨부합니다.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 에러 발생 시 토큰을 재발급하고 요청을 재시도합니다.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도한 적 없는 요청일 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 재발급 요청 (refresh_token은 쿠키로 자동 전송됨)
        const res = await api.post("/api/v1/auth/refresh");
        const newAccessToken = res.data.accessToken;

        // 새 토큰을 로컬스토리지에 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 원래 요청의 헤더를 새 토큰으로 교체 후 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급도 실패하면 로그아웃 처리
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
