// src/components/common/LedgerModal.jsx
// 가계부 내역 생성 / 수정 모달입니다.
// Zustand(useUIStore)로 열림 상태를 관리하고,
// React Query(useMutation)으로 API 요청을 보냅니다.

import { useState, useEffect } from "react";
import useUIStore from "../../store/uiStore";
import { useCreateLedger, useUpdateLedger } from "../../hooks/useLedger";

const CATEGORIES = ["식비", "교통", "쇼핑", "의료", "문화", "급여", "기타"];

export default function LedgerModal() {
  // Zustand에서 모달 상태 읽기
  const { isLedgerModalOpen, editingLedger, closeLedgerModal } = useUIStore();

  const [form, setForm] = useState({
    amount: "",
    category: "식비",
    description: "",
    type: "EXPENSE",
    date: new Date().toISOString().split("T")[0], // 오늘 날짜 기본값
  });

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (editingLedger) {
      setForm({
        amount: editingLedger.amount,
        category: editingLedger.category,
        description: editingLedger.description ?? "",
        type: editingLedger.type,
        date: editingLedger.date,
      });
    } else {
      setForm({
        amount: "",
        category: "식비",
        description: "",
        type: "EXPENSE",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [editingLedger]);

  const createMutation = useCreateLedger();
  const updateMutation = useUpdateLedger();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.date) {
      alert("금액과 날짜는 필수입니다.");
      return;
    }

    const payload = { ...form, amount: Number(form.amount) };

    if (editingLedger) {
      // 수정 모드
      await updateMutation.mutateAsync({ id: editingLedger.id, data: payload });
    } else {
      // 생성 모드
      await createMutation.mutateAsync(payload);
    }

    closeLedgerModal();
  };

  if (!isLedgerModalOpen) return null;

  return (
    // 배경 오버레이
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          {editingLedger ? "내역 수정" : "내역 추가"}
        </h2>

        <div className="space-y-3">
          {/* 수입/지출 선택 */}
          <div className="flex gap-3">
            {["INCOME", "EXPENSE"].map((t) => (
              <button
                key={t}
                onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  form.type === t
                    ? t === "INCOME"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-red-500 text-white border-red-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                {t === "INCOME" ? "수입" : "지출"}
              </button>
            ))}
          </div>

          {/* 금액 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">금액 *</label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">카테고리 *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 메모 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">메모</label>
            <input
              name="description"
              type="text"
              value={form.description}
              onChange={handleChange}
              placeholder="메모를 입력하세요"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* 날짜 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">날짜 *</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={closeLedgerModal}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? "처리 중..." : editingLedger ? "수정" : "추가"}
          </button>
        </div>
      </div>
    </div>
  );
}
