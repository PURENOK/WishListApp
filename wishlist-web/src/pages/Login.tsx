import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await api.post('/auth/login', params);
      
      if (response.data?.access_token) {
        auth.login(response.data.access_token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Неверный email или пароль");
      } else if (!err.response) {
        setError("Сервер недоступен. Проверьте Docker.");
      } else {
        setError("Ошибка входа. Попробуйте еще раз.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Расчет высоты: 100vh минус 64px (высота Navbar)
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Вход</h2>
          <p className="mt-2 text-sm text-gray-600">Рады вас видеть!</p>
        </div>

        <div className="bg-white py-8 px-8 shadow-2xl rounded-3xl border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary transition-all" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Пароль</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary transition-all" />
            </div>

            <Button type="submit" isLoading={isLoading} className="h-14 text-lg">Войти</Button>

            <div className="text-center mt-6">
              <Link to="/register" className="text-sm font-bold text-brand-primary hover:underline">Зарегистрироваться</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;