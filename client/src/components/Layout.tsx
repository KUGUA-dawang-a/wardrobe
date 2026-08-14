/**
 * 页面布局组件
 *
 * 顶部导航栏 + 用户信息，包裹所有页面内容。
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shirt, Sparkles, BookOpen, LogOut, TrendingUp } from 'lucide-react';
import { BrandMark } from './BrandMark';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 当前路由高亮：雾灰蓝胶囊
  const isActive = (path: string) =>
    location.pathname === path
      ? 'bg-primary-soft text-primary-on-soft'
      : 'text-ink-2 hover:text-ink hover:bg-surface-2';

  return (
    <div className="min-h-screen bg-bg">
      {/* 顶部导航 */}
      <nav className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-ink flex items-center gap-2.5">
            <BrandMark />
            我的衣帽间
          </Link>

          <div className="flex items-center gap-1 text-sm">
            <Link to="/" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isActive('/')}`}>
              <Shirt className="w-4 h-4" />
              衣橱
            </Link>
            <Link to="/outfits" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isActive('/outfits')}`}>
              <Sparkles className="w-4 h-4" />
              穿搭
            </Link>
            <Link to="/knowledge" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isActive('/knowledge')}`}>
              <BookOpen className="w-4 h-4" />
              知识库
            </Link>
            <Link to="/trends" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isActive('/trends')}`}>
              <TrendingUp className="w-4 h-4" />
              潮流库
            </Link>

            {user && (
              <div className="flex items-center gap-3 ml-3 pl-3 border-l border-border">
                <span className="text-ink-2 text-xs">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-ink-2 hover:text-danger transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
