// src/api/user.js
// 사용자 계정 관련 API 함수들입니다.

import api from "./axios";

// 내 정보 조회 - GET /api/v1/users/me
export const getMe = () => api.get("/api/v1/users/me");

// 내 정보 수정 - PUT /api/v1/users/me
// name: 수정할 이름 (필수)
export const updateMe = (name) => api.put("/api/v1/users/me", { name });

// 회원 탈퇴 - DELETE /api/v1/users/me
export const deleteMe = () => api.delete("/api/v1/users/me");
