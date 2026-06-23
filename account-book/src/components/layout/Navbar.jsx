// src/components/layout/Navbar.jsx
// 상단 네비게이션 바 컴포넌트입니다.
// Redux에서 로그인 상태를 읽어 버튼을 다르게 표시합니다.

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Redux store에서 인증 상태 읽기
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout()); // Redux 상태 초기화 + localStorage 토큰 삭제
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* 로고 */}
      <Link to="/" className="text-xl font-bold text-indigo-600">
        💰 가계부
      </Link>

      {/* 네비게이션 링크 */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link to="/ledgers" className="text-gray-600 hover:text-indigo-600">
              내역
            </Link>
            <Link to="/compare" className="text-gray-600 hover:text-indigo-600">
              통계
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-indigo-600">
              {user?.name ?? "내 정보"}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-indigo-700"
          >
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}
