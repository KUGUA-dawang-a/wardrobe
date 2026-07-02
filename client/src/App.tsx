/**
 * 应用入口
 *
 * 路由配置 + React Query + Auth 状态包裹。
 * 未登录自动跳转到 /login。
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { WardrobePage } from './pages/WardrobePage';
import { OutfitPage } from './pages/OutfitPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { TrendManagePage } from './pages/TrendManagePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** 需要登录才能访问的页面 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><WardrobePage /></ProtectedRoute>} />
            <Route path="/outfits" element={<ProtectedRoute><OutfitPage /></ProtectedRoute>} />
            <Route path="/knowledge" element={<ProtectedRoute><KnowledgePage /></ProtectedRoute>} />
            <Route path="/trends" element={<ProtectedRoute><TrendManagePage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
