// src/utils/format.js
// 자주 쓰는 포맷 변환 함수들입니다.

// 숫자를 한국 원화 형식으로 변환 (예: 50000 → "50,000원")
export const formatKRW = (amount) => {
  return Number(amount).toLocaleString("ko-KR") + "원";
};

// 날짜 문자열을 보기 좋게 변환 (예: "2024-01-15" → "2024.01.15")
export const formatDate = (dateStr) => {
  return dateStr?.replace(/-/g, ".") ?? "-";
};

// 가계부 타입을 한글로 변환
export const formatType = (type) => {
  return type === "INCOME" ? "수입" : "지출";
};

// 타입에 따른 색상 클래스 반환 (Tailwind)
export const typeColor = (type) => {
  return type === "INCOME" ? "text-blue-600" : "text-red-500";
};
