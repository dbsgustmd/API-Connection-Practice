// src/components/common/PrivateRoute.jsx
// 로그인한 사용자만 접근할 수 있는 라우트 보호 컴포넌트입니다.
// 로그인하지 않으면 /login 으로 리다이렉트합니다.

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
