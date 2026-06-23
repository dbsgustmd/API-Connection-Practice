// src/hooks/useUser.js
// React Query: 사용자 정보 관련 훅입니다.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getMe, updateMe, deleteMe } from "../api/user";
import { setUser, logout } from "../store/slices/authSlice";

export const USER_KEYS = {
  me: ["users", "me"],
};

// 내 정보 조회 훅
export const useMe = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: USER_KEYS.me,
    queryFn: async () => {
      const res = await getMe();
      // 조회 성공 시 Redux 스토어에도 유저 정보 저장
      dispatch(setUser(res.data));
      return res.data;
    },
  });
};

// 내 정보 수정 훅
export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (res) => {
      dispatch(setUser(res.data));
      queryClient.invalidateQueries({ queryKey: USER_KEYS.me });
    },
  });
};

// 회원 탈퇴 훅
export const useDeleteMe = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: deleteMe,
    onSuccess: () => dispatch(logout()),
  });
};
