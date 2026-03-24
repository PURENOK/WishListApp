import React, { useContext } from 'react'; // Добавь импорт React
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// Заменяем JSX.Element на React.ReactElement
export const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const auth = useContext(AuthContext);

  if (auth?.isLoading) return <div>Загрузка...</div>;
  
  if (!auth?.user?.loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};