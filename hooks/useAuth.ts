'use client'

// hooks/useAuth.ts
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: number;
  line_user_id: string;
  display_name: string;
  picture_url?: string;
  created_at: string;
  last_login_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージから認証情報を復元
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } else {
      // テストユーザーとして設定
      const testUser = {
        id: 'test-user-1',
        line_user_id: 'test-user-1',
        display_name: 'テストユーザー',
        picture_url: '/diverse-user-avatars.png',
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString()
      };
      setUser(testUser);
    }
    
    setIsLoading(false);
  }, []);

  // 認証状態をチェック
  const checkAuth = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // トークンが無効な場合
        logout();
      }
    } catch (error) {
      console.error('認証チェックエラー:', error);
      logout();
    }
  };

  // ログイン
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  // ログアウト
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // サーバーサイドのログアウトも実行
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch(console.error);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    checkAuth
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
