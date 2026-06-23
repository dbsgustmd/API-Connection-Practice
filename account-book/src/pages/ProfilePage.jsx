// src/pages/ProfilePage.jsx
// 내 정보 조회/수정 페이지입니다.
// GET /api/v1/users/me, PUT /api/v1/users/me, DELETE /api/v1/users/me 를 사용합니다.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMe, useUpdateMe, useDeleteMe } from "../hooks/useUser";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");

  // React Query: 내 정보 조회 (GET /api/v1/users/me)
  const { data: user, isLoading } = useMe();

  // React Query: 내 정보 수정 (PUT /api/v1/users/me)
  const updateMutation = useUpdateMe();

  // React Query: 회원 탈퇴 (DELETE /api/v1/users/me)
  const deleteMutation = useDeleteMe();

  const handleEdit = () => {
    setName(user?.name ?? "");
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("이름을 입력해 주세요.");
      return;
    }
    await updateMutation.mutateAsync(name);
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (!confirm("정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.")) return;
    await deleteMutation.mutateAsync();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4 text-center py-10 text-gray-400">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">내 정보</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        {/* 이메일 (수정 불가) */}
        <div>
          <p className="text-xs text-gray-400 mb-1">이메일</p>
          <p className="text-sm text-gray-700">{user?.email}</p>
        </div>

        {/* 이름 (수정 가능) */}
        <div>
          <p className="text-xs text-gray-400 mb-1">이름</p>
          {editMode ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          ) : (
            <p className="text-sm text-gray-700">{user?.name}</p>
          )}
        </div>

        {/* 버튼 영역 */}
        {editMode ? (
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setEditMode(false)}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {updateMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="w-full py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm hover:bg-indigo-50"
          >
            이름 수정
          </button>
        )}
      </div>

      {/* 회원 탈퇴 */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="w-full py-2 border border-red-300 text-red-500 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50"
        >
          {deleteMutation.isPending ? "처리 중..." : "회원 탈퇴"}
        </button>
      </div>
    </div>
  );
}
