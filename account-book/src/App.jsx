// src/App.jsx
// 앱의 최상위 컴포넌트입니다.
// React Router로 페이지를 연결하고,
// PrivateRoute로 인증이 필요한 페이지를 보호합니다.

import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import PrivateRoute from "./components/common/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import LedgerListPage from "./pages/LedgerListPage";
import ComparePage from "./pages/ComparePage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 네비게이션 바 */}
      <Navbar />

      <main className="py-6">
        <Routes>
          {/* 기본 경로: 가계부 목록으로 이동 */}
          <Route path="/" element={<Navigate to="/ledgers" replace />} />

          {/* 로그인 페이지 (인증 불필요) */}
          <Route path="/login" element={<LoginPage />} />

          {/* 인증이 필요한 페이지들 */}
          <Route
            path="/ledgers"
            element={
              <PrivateRoute>
                <LedgerListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/compare"
            element={
              <PrivateRoute>
                <ComparePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
