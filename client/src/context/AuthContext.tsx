/**
 * 登录状态管理
 *
 * 提供 AuthProvider 包裹整个应用，
 * 子组件通过 useAuth() 获取登录状态、用户信息、登录/登出方法。
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { post } from '../api/client';

interface User {
  userId: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化：从 localStorage 恢复登录状态
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 登录
  const login = useCallback(async (username: string, password: string) => {
    const data = await post<{ token: string; userId: string; username: string }>(
      '/auth/login',
      { username, password },
    );
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ userId: data.userId, username: data.username }));
    setToken(data.token);
    setUser({ userId: data.userId, username: data.username });
  }, []);

  // 注册（注册成功后自动登录）
  const register = useCallback(async (username: string, password: string) => {
    const data = await post<{ token: string; userId: string; username: string }>(
      '/auth/register',
      { username, password },
    );
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ userId: data.userId, username: data.username }));
    setToken(data.token);
    setUser({ userId: data.userId, username: data.username });
  }, []);

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/** 在组件中获取登录状态 */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内部使用');
  return ctx;
}
