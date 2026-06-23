// src/pages/AdminPage.jsx
// 관리자 페이지입니다. ROOT 권한 계정만 이용 가능합니다.
// GET /api/v1/admin/users, DELETE /api/v1/admin/users/:id 를 사용합니다.

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, deleteAdminUser, getAdminAllLedgers } from "../api/admin";

export default function AdminPage() {
  const [tab, setTab] = useState("users"); // "users" | "ledgers"
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  // React Query: 전체 사용자 조회 (GET /api/v1/admin/users)
  const usersQuery = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => getAdminUsers({ page, size: 10 }).then((r) => r.data),
    enabled: tab === "users",
  });

  // React Query: 전체 가계부 조회 (GET /api/v1/admin/ledgers/all)
  const ledgersQuery = useQuery({
    queryKey: ["admin", "ledgers", page],
    queryFn: () => getAdminAllLedgers({ page, size: 10 }).then((r) => r.data),
    enabled: tab === "ledgers",
  });

  // React Query: 사용자 강제 탈퇴 (DELETE /api/v1/admin/users/:id)
  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const handleDeleteUser = async (id, email) => {
    if (!confirm(`${email} 사용자를 강제 탈퇴 처리할까요?`)) return;
    await deleteMutation.mutateAsync(id);
  };

  const currentQuery = tab === "users" ? usersQuery : ledgersQuery;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">관리자 패널</h1>

      {/* 탭 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setTab("users"); setPage(0); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "users"
              ? "bg-indigo-600 text-white"
              : "border border-gray-300 text-gray-600"
          }`}
        >
          전체 사용자
        </button>
        <button
          onClick={() => { setTab("ledgers"); setPage(0); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "ledgers"
              ? "bg-indigo-600 text-white"
              : "border border-gray-300 text-gray-600"
          }`}
        >
          전체 가계부
        </button>
      </div>

      {/* 로딩 */}
      {currentQuery.isLoading && (
        <div className="text-center py-10 text-gray-400">불러오는 중...</div>
      )}

      {/* 에러 */}
      {currentQuery.isError && (
        <div className="text-center py-10 text-red-400">
          접근 권한이 없거나 오류가 발생했습니다.
        </div>
      )}

      {/* 사용자 목록 */}
      {tab === "users" && usersQuery.data && (
        <div className="space-y-2">
          {(usersQuery.data.content ?? usersQuery.data).map((u) => (
            <div
              key={u.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
              </div>
              <button
                onClick={() => handleDeleteUser(u.id, u.email)}
                className="text-xs text-red-500 hover:text-red-700 px-3 py-1 border border-red-300 rounded-lg"
              >
                강제 탈퇴
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 가계부 목록 */}
      {tab === "ledgers" && ledgersQuery.data && (
        <div className="space-y-2">
          {(ledgersQuery.data.content ?? ledgersQuery.data).map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.category} — {item.description || "메모 없음"}
                </p>
                <p className="text-xs text-gray-400">
                  userId: {item.userId} | {item.date}
                </p>
              </div>
              <p
                className={`text-sm font-semibold ${
                  item.type === "INCOME" ? "text-blue-600" : "text-red-500"
                }`}
              >
                {Number(item.amount).toLocaleString()}원
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {currentQuery.data?.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 border rounded text-sm disabled:opacity-40"
          >
            이전
          </button>
          <span className="px-3 py-1.5 text-sm text-gray-600">
            {page + 1} / {currentQuery.data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= currentQuery.data.totalPages - 1}
            className="px-3 py-1.5 border rounded text-sm disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
