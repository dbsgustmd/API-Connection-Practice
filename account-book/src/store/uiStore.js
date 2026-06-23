// src/store/uiStore.js
// Zustand: UI 관련 상태를 관리합니다.
// Redux가 "앱의 핵심 데이터(인증)"를 담당한다면,
// Zustand는 "화면 동작(모달 열기/닫기)"처럼 가볍고 빠른 상태에 사용합니다.

import { create } from "zustand";

const useUIStore = create((set) => ({
  // 가계부 생성/수정 모달 상태
  isLedgerModalOpen: false,
  // 수정 시 어떤 항목을 편집 중인지 저장 (null이면 신규 생성)
  editingLedger: null,

  // 모달 열기: 수정할 항목을 넘기면 수정 모드, 안 넘기면 생성 모드
  openLedgerModal: (ledger = null) =>
    set({ isLedgerModalOpen: true, editingLedger: ledger }),

  // 모달 닫기: 편집 중인 항목도 초기화
  closeLedgerModal: () =>
    set({ isLedgerModalOpen: false, editingLedger: null }),
}));

export default useUIStore;
