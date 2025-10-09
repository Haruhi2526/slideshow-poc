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
  loginWithLiff: (liffUser: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージから認証情報を復元
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');
        
        if (savedToken && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log('認証情報を復元:', parsedUser);
          setToken(savedToken);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('認証情報の復元エラー:', error);
        // エラーが発生した場合は認証情報をクリア
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
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

  // LIFFユーザーでログイン
  const loginWithLiff = async (liffUser: any) => {
    try {
      const response = await fetch('/api/auth/liff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: liffUser }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user);
      } else {
        throw new Error('LIFF認証に失敗しました');
      }
    } catch (error) {
      console.error('LIFFログインエラー:', error);
      throw error;
    }
  };

  // ログイン
  const login = (newToken: string, newUser: User) => {
    console.log('ログイン処理開始:', newUser);
    
    // 状態を同期的に更新
    setToken(newToken);
    setUser(newUser);
    
    // ローカルストレージに保存
    try {
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      console.log('ログイン処理完了 - ローカルストレージに保存済み');
    } catch (error) {
      console.error('ローカルストレージ保存エラー:', error);
    }
  };

  // ログアウト
  const logout = () => {
    console.log('ログアウト処理開始');
    setToken(null);
    setUser(null);
    
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('ローカルストレージ削除エラー:', error);
    }
    
    // サーバーサイドのログアウトも実行
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(console.error);
    }
    console.log('ログアウト処理完了');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    checkAuth,
    loginWithLiff
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
