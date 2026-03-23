import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, ExternalLink, CheckCircle2, Circle, Gift, Edit2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Wishlist } from '../types';
import api from '../api/axiosInstance';

const WishlistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [isItemOpen, setIsItemOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/wishlists/${id}`);
        setList(res.data);
      } catch (e) {
        // РЕЖИМ ТЕСТА
        setList({
          id: id || '1', title: 'День Рождения', description: 'Мой список желаний', is_public: true, items_count: 2,
          items: [
            { id: 'i1', title: 'Кроссовки Nike', price: 12000, currency: 'RUB', is_purchased: false, priority: 5, url: 'https://nike.com' },
            { id: 'i2', title: 'Наушники', price: 2500, currency: 'RUB', is_purchased: true, priority: 3 }
          ]
        } as any);
      } finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try { await api.delete(`/wishlists/${id}`); navigate('/dashboard'); } 
    catch { setIsDelOpen(false); alert("Тест: удаление не сработало без бэкенда"); }
  };

  if (loading) return <div className="text-center mt-20">Загрузка...</div>;
  if (!list) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-brand-primary mb-6 transition-all">
        <ArrowLeft size={20} className="mr-2"/> Назад
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{list.title}</h1>
          <p className="text-gray-500 mt-2">{list.description || 'Описания нет'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="danger" className="w-12 h-12 p-0 rounded-2xl" onClick={() => setIsDelOpen(true)}>
            <Trash2 size={20} />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Товары</h2>
        <Button onClick={() => setIsItemOpen(true)} className="w-auto py-2 px-4 flex gap-2"><Plus size={18} /> Добавить</Button>
      </div>

      <div className="space-y-3">
        {list.items?.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:border-brand-primary transition-all">
            <div className="text-brand-primary cursor-pointer">
              {item.is_purchased ? <CheckCircle2 size={24} className="text-green-500" /> : <Circle size={24} className="text-gray-300" />}
            </div>
            <div className="flex-1">
              <h4 className={`font-bold ${item.is_purchased ? 'line-through text-gray-400' : ''}`}>{item.title}</h4>
              <p className="text-brand-primary font-bold text-sm">{item.price} {item.currency}</p>
            </div>
            {item.url && <a href={item.url} target="_blank" className="text-gray-400 hover:text-brand-primary"><ExternalLink size={18} /></a>}
          </div>
        ))}
      </div>

      {/* Модалка Удаления */}
      <Modal isOpen={isDelOpen} onClose={() => setIsDelOpen(false)} title="Удалить список?">
        <div className="text-center">
          <p className="text-gray-500 mb-6">Все товары в этом списке будут удалены навсегда.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsDelOpen(false)}>Отмена</Button>
            <Button variant="danger" onClick={handleDelete}>Удалить</Button>
          </div>
        </div>
      </Modal>

      {/* Модалка Добавления Товара */}
      <Modal isOpen={isItemOpen} onClose={() => setIsItemOpen(false)} title="Новый подарок">
        <div className="space-y-4">
          <input className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Название *" />
          <input className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Ссылка (URL)" />
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Цена" type="number" />
            <select className="w-full border rounded-xl px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-brand-primary">
              <option>RUB</option><option>USD</option>
            </select>
          </div>
          <Button onClick={() => setIsItemOpen(false)}>Добавить в список</Button>
        </div>
      </Modal>
    </div>
  );
};

export default WishlistDetail;