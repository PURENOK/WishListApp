import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Логотип */}
          <Link to="/dashboard" className="flex items-center gap-2 text-brand-primary font-bold text-xl">
            <Gift size={28} />
            <span className="hidden sm:inline">WishList App</span>
          </Link>

          {/* Кнопка выхода (только если залогинен) */}
          {auth?.user?.loggedIn && (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-brand-error transition-colors font-medium text-sm"
            >
              <LogOut size={18} />
              <span>Выйти</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};