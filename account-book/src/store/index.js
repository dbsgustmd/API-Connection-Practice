// src/store/index.js
// Redux 스토어를 생성하고 내보냅니다.
// 여러 slice를 합쳐서 하나의 store로 만듭니다.

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // 슬라이스가 추가될 때 여기에 등록합니다.
  },
});

export default store;
