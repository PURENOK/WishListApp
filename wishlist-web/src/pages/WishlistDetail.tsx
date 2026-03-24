import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trash2, Plus, ExternalLink, 
  CheckCircle2, Circle, Gift, Edit2, Star, MessageSquare 
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Wishlist, WishlistItem } from '../types';
import api from '../api/axiosInstance';

const WishlistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [list, setList] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);

  // Состояния модалок
  const [isDelListOpen, setIsDelListOpen] = useState(false);
  const [isEditListOpen, setIsEditListOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  
  // Форма списка
  const [listForm, setListForm] = useState({ title: '', description: '', is_public: false });

  // Форма товара (все поля согласно п. 4.4 ТЗ)
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [itemForm, setItemForm] = useState({
    title: '',
    url: '',
    price: '' as string | number, // Изменили с 0 на ''
    currency: 'BYN',
    image_url: '',
    priority: 3,
    note: ''
  });

  const fetchData = async () => {
    try {
      const res = await api.get(`/wishlists/${id}`);
      setList(res.data);
      setListForm({ title: res.data.title, description: res.data.description || '', is_public: res.data.is_public });
    } catch (e) {
      // Mock-данные для теста, если бэкенд не готов
      setList({
        id: id || '1',
        title: 'Мой День Рождения',
        description: 'Список подарков, которые я был бы рад получить!',
        is_public: true,
        items_count: 2,
        items: [
          { id: 'i1', title: 'Кроссовки Nike Air Max', price: 350, currency: 'BYN', is_purchased: false, priority: 5, url: 'https://nike.com', note: 'Размер 42, синие' },
          { id: 'i2', title: 'Умная колонка', price: 150, currency: 'BYN', is_purchased: true, priority: 3, url: '', image_url: '', note: '' }
        ]
      } as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const openAddItem = () => {
    setEditingItem(null);
    // Ставим пустую строку вместо 0
    setItemForm({ title: '', url: '', price: '', currency: 'BYN', image_url: '', priority: 3, note: '' });
    setIsItemModalOpen(true);
  };

  const openEditItem = (item: WishlistItem) => {
    setEditingItem(item);
    setItemForm({
      title: item.title,
      url: item.url || '',
      price: item.price.toString(), // Конвертируем число из базы в строку для инпута
      currency: item.currency,
      image_url: item.image_url || '',
      priority: item.priority,
      note: item.note || ''
    });
    setIsItemModalOpen(true);
  };

  const togglePurchased = async (itemId: string) => {
    if (!list || !list.items) return;
    const updatedItems = list.items.map(item => 
      item.id === itemId ? { ...item, is_purchased: !item.is_purchased } : item
    );
    setList({ ...list, items: updatedItems });
    // api.patch(`/wishlists/${id}/items/${itemId}`, { is_purchased: ... })
  };

  const handleSaveItem = async () => {
    if (!itemForm.title) return;

    // Создаем объект для отправки, где принудительно конвертируем цену в число
    const finalData = {
      ...itemForm,
      price: itemForm.price === '' ? 0 : parseFloat(itemForm.price.toString())
    };

    try {
      console.log("Отправка на бэкенд:", finalData);
      // await api.post(..., finalData);
      setIsItemModalOpen(false);
      fetchData();
    } catch (e) {
      alert("Ошибка сохранения");
    }
  };

  const handleDeleteList = async () => {
    try {
      await api.delete(`/wishlists/${id}`);
      navigate('/dashboard');
    } catch (e) { navigate('/dashboard'); }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Загрузка данных...</div>;
  if (!list) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Навигация */}
      <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-brand-primary mb-6 transition-all group">
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Назад к спискам
      </button>

      {/* Шапка списка (п. 4.3 и 4.7) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{list.title}</h1>
              <span className="px-2.5 py-1 bg-indigo-50 text-brand-primary text-[10px] font-bold rounded-lg uppercase tracking-wider">
                {list.is_public ? 'Публичный' : 'Приватный'}
              </span>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed">{list.description || 'Описание не добавлено'}</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="secondary" className="flex-1 sm:w-12 sm:h-12 p-0 rounded-2xl" onClick={() => setIsEditListOpen(true)}>
              <Edit2 size={20} />
            </Button>
            <Button variant="danger" className="flex-1 sm:w-12 sm:h-12 p-0 rounded-2xl" onClick={() => setIsDelListOpen(true)}>
              <Trash2 size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Секция товаров */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Подарки ({list.items?.length || 0})</h2>
        <Button onClick={openAddItem} className="w-full sm:w-auto py-2.5 px-6 flex gap-2 h-11 shadow-md">
          <Plus size={18} /> Добавить подарок
        </Button>
      </div>

      {/* Список товаров (п. 4.8) */}
      <div className="space-y-4">
        {!list.items || list.items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-400">
            <Gift className="mx-auto mb-3 opacity-20" size={48} />
            <p>В этом списке пока нет подарков</p>
          </div>
        ) : (
          list.items.map((item) => (
            <div key={item.id} className={`bg-white p-5 rounded-3xl border transition-all flex items-center gap-5 group ${item.is_purchased ? 'border-gray-50 opacity-60' : 'border-gray-100 hover:border-brand-primary shadow-sm'}`}>
              
              <div onClick={() => togglePurchased(item.id)} className="text-brand-primary cursor-pointer hover:scale-110 transition-transform">
                {item.is_purchased ? <CheckCircle2 size={30} className="text-green-500" /> : <Circle size={30} className="text-gray-200" />}
              </div>

              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-primary flex-shrink-0 overflow-hidden border border-gray-100">
                {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : <Gift size={28} className="opacity-20" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-bold truncate text-lg ${item.is_purchased ? 'line-through text-gray-400' : 'text-gray-900'}`}>{item.title}</h4>
                  <div className="flex items-center text-amber-400 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    <Star size={10} className="fill-current mr-0.5" /> {item.priority}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm font-bold">
                  <span className="text-brand-primary">{item.price.toLocaleString()} {item.currency}</span>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-primary"><ExternalLink size={16} /></a>
                  )}
                </div>

                {item.note && (
                  <p className="text-gray-400 text-xs mt-2 flex items-center gap-1.5">
                    <MessageSquare size={12} /> {item.note}
                  </p>
                )}
              </div>

              <div className="flex gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditItem(item)} className="p-2.5 text-gray-400 hover:text-brand-primary hover:bg-indigo-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                <button className="p-2.5 text-gray-400 hover:text-brand-error hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* МОДАЛКИ */}

      {/* 1. Модалка Редактирования Списка */}
      <Modal isOpen={isEditListOpen} onClose={() => setIsEditListOpen(false)} title="Настройки списка">
        <div className="space-y-4">
          <input className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary" value={listForm.title} onChange={e => setListForm({...listForm, title: e.target.value})} placeholder="Название *" />
          <textarea className="w-full border border-gray-200 rounded-2xl px-4 py-3 h-32 outline-none focus:ring-2 focus:ring-brand-primary resize-none" value={listForm.description} onChange={e => setListForm({...listForm, description: e.target.value})} placeholder="Описание" />
          <Button onClick={() => setIsEditListOpen(false)}>Сохранить изменения</Button>
        </div>
      </Modal>

      {/* 2. Модалка Товара (п. 4.4) */}
      <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title={editingItem ? "Изменить товар" : "Новый подарок"}>
        <div className="space-y-4">
          <input className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Название *" value={itemForm.title} onChange={e => setItemForm({...itemForm, title: e.target.value})} />
          <input className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Ссылка на магазин (URL)" value={itemForm.url} onChange={e => setItemForm({...itemForm, url: e.target.value})} />
          <input className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Ссылка на изображение" value={itemForm.image_url} onChange={e => setItemForm({...itemForm, image_url: e.target.value})} />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Цена</label>
            <input 
              type="number" 
              step="0.01" // Разрешаем копейки
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-primary transition-all" 
              placeholder="0.00"
              value={itemForm.price} // Привязано к строке
              onChange={e => setItemForm({...itemForm, price: e.target.value})} // Просто передаем значение
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
              Приоритет подарка
            </label>
            <select 
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-primary bg-white cursor-pointer transition-all"
              value={itemForm.priority}
              onChange={e => setItemForm({...itemForm, priority: Number(e.target.value)})}
            >
              <option value="1">1 — Низкий (может подождать)</option>
              <option value="2">2 — Ниже среднего (не к спеху)</option>
              <option value="3">3 — Средний (обычный)</option>
              <option value="4">4 — Высокий (очень хочется)</option>
              <option value="5">5 — Максимальный (мечта!)</option>
            </select>
            <p className="text-[10px] text-gray-400 mt-1.5 ml-1 uppercase tracking-wider font-medium">
              Определяет порядок отображения в списке
            </p>
          </div>

          <textarea className="w-full border border-gray-200 rounded-2xl px-4 py-3 h-24 outline-none focus:ring-2 focus:ring-brand-primary resize-none" placeholder="Комментарий (напр. цвет, размер)" value={itemForm.note} onChange={e => setItemForm({...itemForm, note: e.target.value})} />
          
          <Button onClick={handleSaveItem}>{editingItem ? "Сохранить изменения" : "Добавить в список"}</Button>
        </div>
      </Modal>

      {/* 3. Модалка Удаления списка */}
      <Modal isOpen={isDelListOpen} onClose={() => setIsDelListOpen(false)} title="Удалить список?">
        <div className="text-center px-2">
          <p className="text-gray-500 mb-8 leading-relaxed text-sm">Это действие нельзя отменить. Все подарки в этом списке будут удалены навсегда.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsDelListOpen(false)}>Отмена</Button>
            <Button variant="danger" onClick={handleDeleteList}>Да, удалить</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WishlistDetail;