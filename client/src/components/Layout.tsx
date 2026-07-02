/**
 * 页面布局组件
 *
 * 顶部导航栏 + 侧边用户信息，包裹所有页面内容。
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shirt, Sparkles, BookOpen, LogOut, TrendingUp } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 当前路由高亮
  const isActive = (path: string) =>
    location.pathname === path ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-white';

  return (
    <div className="min-h-screen bg-slate-900">
      {/* 顶部导航 */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-white flex items-center gap-2">
            <Shirt className="w-5 h-5 text-indigo-400" />
            我的衣帽间
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className={`flex items-center gap-1 ${isActive('/')}`}>
              <Shirt className="w-4 h-4" />
              衣橱
            </Link>
            <Link to="/outfits" className={`flex items-center gap-1 ${isActive('/outfits')}`}>
              <Sparkles className="w-4 h-4" />
              穿搭
            </Link>
            <Link to="/knowledge" className={`flex items-center gap-1 ${isActive('/knowledge')}`}>
              <BookOpen className="w-4 h-4" />
              知识库
            </Link>
            <Link to="/trends" className={`flex items-center gap-1 ${isActive('/trends')}`}>
              <TrendingUp className="w-4 h-4" />
              潮流库
            </Link>

            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-600">
                <span className="text-slate-300 text-xs">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 transition-colors"
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
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
