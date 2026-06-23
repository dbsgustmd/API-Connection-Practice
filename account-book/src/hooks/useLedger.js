// src/hooks/useLedger.js
// React Query: 가계부 관련 서버 상태를 관리하는 커스텀 훅입니다.
// useQuery  → 데이터 조회 (GET)
// useMutation → 데이터 변경 (POST, PUT, DELETE)

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLedgers,
  getLedger,
  createLedger,
  updateLedger,
  deleteLedger,
  compareExpenditure,
} from "../api/ledger";

// 쿼리 키: React Query가 캐시를 식별하는 데 사용하는 고유 키
export const LEDGER_KEYS = {
  all: ["ledgers"],
  list: (params) => ["ledgers", "list", params],
  detail: (id) => ["ledgers", id],
  compare: ["ledgers", "compare"],
};

// 가계부 목록 조회 훅
export const useLedgers = (params) => {
  return useQuery({
    queryKey: LEDGER_KEYS.list(params),
    queryFn: () => getLedgers(params).then((res) => res.data),
  });
};

// 가계부 단건 조회 훅
export const useLedger = (id) => {
  return useQuery({
    queryKey: LEDGER_KEYS.detail(id),
    queryFn: () => getLedger(id).then((res) => res.data),
    enabled: !!id, // id가 있을 때만 요청
  });
};

// 전국 평균 비교 훅
export const useCompare = () => {
  return useQuery({
    queryKey: LEDGER_KEYS.compare,
    queryFn: () => compareExpenditure().then((res) => res.data),
  });
};

// 가계부 생성 훅
export const useCreateLedger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLedger,
    // 성공하면 목록 캐시를 무효화해서 자동으로 재조회
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LEDGER_KEYS.all }),
  });
};

// 가계부 수정 훅
export const useUpdateLedger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateLedger(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LEDGER_KEYS.all }),
  });
};

// 가계부 삭제 훅
export const useDeleteLedger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLedger,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LEDGER_KEYS.all }),
  });
};
