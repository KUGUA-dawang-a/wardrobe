/**
 * 登录 / 注册页面
 *
 * 支持登录和注册切换，表单验证 + 错误提示。
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shirt } from 'lucide-react';

export function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 表单验证
    if (username.length < 2) {
      setError('用户名至少 2 个字符');
      return;
    }
    if (password.length < 4) {
      setError('密码至少 4 个字符');
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-sm shadow-xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <Shirt className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
          <h1 className="text-xl font-bold text-white">我的衣帽间</h1>
          <p className="text-slate-400 text-xs mt-1">虚拟衣橱 + AI 穿搭推荐</p>
        </div>

        {/* 切换标签 */}
        <div className="flex gap-1 bg-slate-700 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-2 text-sm rounded-md transition-colors ${
              !isRegister ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-2 text-sm rounded-md transition-colors ${
              isRegister ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            注册
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="用户名"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm border border-slate-600 focus:border-indigo-400 outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="密码"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm border border-slate-600 focus:border-indigo-400 outline-none"
          />

          {isRegister && (
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="确认密码"
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 text-sm border border-slate-600 focus:border-indigo-400 outline-none"
            />
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            {loading ? '处理中...' : isRegister ? '注册' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}
