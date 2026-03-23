import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import api from '../api/axiosInstance';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Пароли не совпадают');
    
    setIsLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      alert('Регистрация прошла успешно!');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Создать аккаунт</h2>
          <p className="mt-2 text-sm text-gray-600">Начните свой список желаний прямо сейчас</p>
        </div>

        <div className="bg-white py-8 px-8 shadow-2xl rounded-3xl border border-gray-100">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-brand-error text-sm rounded-xl border border-red-100">{error}</div>}
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-primary" 
                placeholder="ivan@example.com" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Пароль</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Подтвердите пароль</label>
              <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-4">Зарегистрироваться</Button>

            <div className="text-center mt-6">
              <span className="text-sm text-gray-600">Уже есть аккаунт? </span>
              <Link to="/login" className="text-sm font-bold text-brand-primary hover:underline">Войти</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;