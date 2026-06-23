// src/api/ledger.js
// 가계부 내역 관련 API 함수들입니다.

import api from "./axios";

// 가계부 내역 생성 - POST /api/v1/ledgers
// data: { amount, category, description, type, date }
export const createLedger = (data) => api.post("/api/v1/ledgers", data);

// 가계부 내역 단건 조회 - GET /api/v1/ledgers/:id
export const getLedger = (id) => api.get(`/api/v1/ledgers/${id}`);

// 나의 가계부 목록 조회 - GET /api/v1/ledgers?page=0&size=10
// params: { page, size, sort }
export const getLedgers = (params) => api.get("/api/v1/ledgers", { params });

// 가계부 내역 수정 - PUT /api/v1/ledgers/:id
export const updateLedger = (id, data) => api.put(`/api/v1/ledgers/${id}`, data);

// 가계부 내역 삭제 - DELETE /api/v1/ledgers/:id
export const deleteLedger = (id) => api.delete(`/api/v1/ledgers/${id}`);

// 전국 평균 지출 비교 - GET /api/v1/ledgers/compare
export const compareExpenditure = () => api.get("/api/v1/ledgers/compare");

// 영수증 이미지 업로드 - POST /api/v1/ledgers/receipt/upload
// file: 이미지 파일 (multipart/form-data)
export const uploadReceipt = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/v1/ledgers/receipt/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
