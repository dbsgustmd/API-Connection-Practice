// src/pages/LedgerListPage.jsx
// 가계부 내역 목록 페이지입니다.
// React Query(useQuery)로 목록을 가져오고,
// Zustand(useUIStore)로 모달을 열고 닫습니다.

import { useState } from "react";
import { useLedgers, useDeleteLedger } from "../hooks/useLedger";
import { uploadReceipt } from "../api/ledger";
import useUIStore from "../store/uiStore";
import LedgerModal from "../components/common/LedgerModal";
import { formatKRW, formatDate, formatType, typeColor } from "../utils/format";

export default function LedgerListPage() {
  const [page, setPage] = useState(0);
  // Zustand: 모달 열기 함수
  const { openLedgerModal } = useUIStore();

  // React Query: 목록 조회
  // useLedgers 훅 내부에서 GET /api/v1/ledgers?page=0&size=10 을 호출합니다
  const { data, isLoading, isError } = useLedgers({ page, size: 10 });

  // React Query: 삭제 뮤테이션
  const deleteMutation = useDeleteLedger();

  const handleDelete = async (id) => {
    if (!confirm("정말 삭제할까요?")) return;
    await deleteMutation.mutateAsync(id);
  };

  // 영수증 이미지 업로드 핸들러
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await uploadReceipt(file);
      alert("영수증을 업로드했습니다. 분석 후 자동으로 등록됩니다.");
    } catch {
      alert("업로드에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">가계부 내역</h1>
        <div className="flex gap-2">
          {/* 영수증 업로드 버튼 */}
          <label className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200">
            📷 영수증
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleReceiptUpload}
            />
          </label>
          {/* 내역 추가 버튼: Zustand로 모달 열기 */}
          <button
            onClick={() => openLedgerModal()}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700"
          >
            + 추가
          </button>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-10 text-gray-400">불러오는 중...</div>
      )}

      {/* 에러 상태 */}
      {isError && (
        <div className="text-center py-10 text-red-400">
          데이터를 불러오지 못했습니다.
        </div>
      )}

      {/* 내역 목록 */}
      {data && (
        <>
          {/* 백엔드 응답 구조에 따라 content 또는 배열 자체 사용 */}
          {(data.content ?? data).length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              아직 내역이 없습니다. 추가해 보세요!
            </div>
          ) : (
            <ul className="space-y-2">
              {(data.content ?? data).map((item) => (
                <li
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                >
                  {/* 왼쪽: 카테고리 + 메모 + 날짜 */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {formatType(item.type)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(item.date)}
                    </p>
                  </div>

                  {/* 오른쪽: 금액 + 버튼 */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-semibold text-sm ${typeColor(item.type)}`}
                    >
                      {item.type === "INCOME" ? "+" : "-"}
                      {formatKRW(item.amount)}
                    </span>
                    <div className="flex gap-1">
                      {/* 수정 버튼: Zustand로 수정 모드 모달 열기 */}
                      <button
                        onClick={() => openLedgerModal(item)}
                        className="text-xs text-gray-500 hover:text-indigo-600 px-2 py-1 rounded"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs text-gray-500 hover:text-red-500 px-2 py-1 rounded"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* 페이지네이션 */}
          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40"
              >
                이전
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600">
                {page + 1} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.totalPages - 1}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {/* 가계부 생성/수정 모달 */}
      <LedgerModal />
    </div>
  );
}
