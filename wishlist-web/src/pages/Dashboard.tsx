import React, { useEffect, useState } from 'react';
import { Plus, Gift, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Wishlist } from '../types';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import api from '../api/axiosInstance';

const Dashboard = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newList, setNewList] = useState({ title: '', description: '', is_public: false });

  const fetchWishlists = async () => {
    try {
      const res = await api.get('/wishlists');
      setWishlists(res.data);
    } catch (e) {
      // РЕЖИМ ТЕСТА: Если бэк не отвечает, ставим тестовые данные
      setWishlists([
        { id: '1', title: 'День Рождения', description: 'Что я хочу на 20 лет', is_public: true, items_count: 2 },
        { id: '2', title: 'Новый Год', description: 'Подарки семье', is_public: false, items_count: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlists(); }, []);

  const handleCreate = async () => {
    if (!newList.title) return;
    try {
      await api.post('/wishlists', newList);
      setIsModalOpen(false);
      fetchWishlists();
    } catch (e) {
      alert("В тестовом режиме создание не отправится на сервер");
      setIsModalOpen(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Мои списки</h1>
        <Button onClick={() => setIsModalOpen(true)} className="w-auto flex gap-2">
          <Plus size={20} /> Создать список
        </Button>
      </div>

      {wishlists.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
          <Gift className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">Списков пока нет</h3>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)} className="w-auto mt-4 mx-auto">Создать первый</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map(list => (
            <Link key={list.id} to={`/wishlist/${list.id}`} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-primary hover:shadow-md transition-all group">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{list.title}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{list.description || 'Нет описания'}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-indigo-50 text-brand-primary">Подарков: {list.items_count}</span>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-primary" />
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Новый список">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <input className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-primary" 
              placeholder="Например: Мои хотелки" onChange={e => setNewList({...newList, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea className="w-full border rounded-xl px-4 py-2 h-24 outline-none focus:ring-2 focus:ring-brand-primary" 
              placeholder="Коротко о списке..." onChange={e => setNewList({...newList, description: e.target.value})} />
          </div>
          <Button onClick={handleCreate}>Создать список</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;