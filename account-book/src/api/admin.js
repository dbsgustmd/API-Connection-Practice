// src/api/admin.js
// 관리자 전용 API 함수들입니다. ROOT 권한 계정만 사용 가능합니다.

import api from "./axios";

// 전체 사용자 조회 - GET /api/v1/admin/users
export const getAdminUsers = (params) => api.get("/api/v1/admin/users", { params });

// 특정 사용자 조회 - GET /api/v1/admin/users/:id
export const getAdminUser = (id) => api.get(`/api/v1/admin/users/${id}`);

// 사용자 강제 탈퇴 - DELETE /api/v1/admin/users/:id
export const deleteAdminUser = (id) => api.delete(`/api/v1/admin/users/${id}`);

// 전체 가계부 내역 조회 - GET /api/v1/admin/ledgers/all
export const getAdminAllLedgers = (params) =>
  api.get("/api/v1/admin/ledgers/all", { params });

// 특정 사용자 가계부 조회 - GET /api/v1/admin/ledgers/users/:userId
export const getAdminUserLedgers = (userId, params) =>
  api.get(`/api/v1/admin/ledgers/users/${userId}`, { params });

// 가계부 단건 조회 (관리자) - GET /api/v1/admin/ledgers/:id
export const getAdminLedger = (id) => api.get(`/api/v1/admin/ledgers/${id}`);
