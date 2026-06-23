// src/store/slices/authSlice.js
// Redux: 인증 상태를 전역으로 관리합니다.
// 로그인 여부, 현재 유저 정보를 앱 어디서든 꺼내 쓸 수 있습니다.

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // localStorage에 토큰이 있으면 로그인 상태로 초기화
  isLoggedIn: !!localStorage.getItem("accessToken"),
  user: null, // { id, email, name }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 로그인 액션: 토큰 저장 + 상태 업데이트
    login(state, action) {
      const { accessToken, user } = action.payload;
      localStorage.setItem("accessToken", accessToken);
      state.isLoggedIn = true;
      state.user = user;
    },
    // 로그아웃 액션: 토큰 제거 + 상태 초기화
    logout(state) {
      localStorage.removeItem("accessToken");
      state.isLoggedIn = false;
      state.user = null;
    },
    // 유저 정보만 업데이트 (내 정보 수정 후 사용)
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
