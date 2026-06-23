// src/pages/LoginPage.jsx
// 로그인 페이지입니다.
// 실제 프로젝트에서는 소셜 로그인 등을 연결하지만,
// 실습에서는 accessToken을 직접 입력해서 테스트할 수 있도록 구성했습니다.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { getMe } from "../api/user";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 실습용: accessToken을 직접 입력하는 방식
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!token.trim()) {
      setError("토큰을 입력하세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 토큰을 먼저 localStorage에 임시 저장
      localStorage.setItem("accessToken", token);

      // /api/v1/users/me 를 호출해서 유저 정보를 가져옴
      const res = await getMe();

      // Redux에 로그인 상태와 유저 정보 저장
      dispatch(login({ accessToken: token, user: res.data }));

      navigate("/ledgers");
    } catch (err) {
      setError("토큰이 유효하지 않습니다. 다시 확인해 주세요.");
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-2">
          💰 가계부
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          OCR 가계부 앱에 오신 것을 환영합니다
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Access Token
            </label>
            <textarea
              rows={3}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="백엔드에서 발급받은 accessToken을 붙여넣으세요"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          ※ 실습용 로그인 화면입니다. 백엔드 서버에서 발급된 토큰을 사용하세요.
        </p>
      </div>
    </div>
  );
}
