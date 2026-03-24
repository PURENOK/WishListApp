export interface User {
  id: string;
  email: string;
  is_active: boolean;
}

export interface Wishlist {
  id: string;
  title: string;
  description?: string;
  is_public: boolean;
  items_count: number;
  items?: WishlistItem[];
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  item_id: string;
  title: string;      // Название (из таблицы Item)
  url?: string;       // Ссылка (из таблицы Item)
  price: number;      // Цена (из таблицы Item)
  currency: string;   // Валюта (из таблицы Item)
  image_url?: string; // Картинка (из таблицы Item)
  priority: number;   // Приоритет 1-5 (из WishlistItem)
  note?: string;      // Комментарий (из WishlistItem)
  is_purchased: boolean; // Статус покупки
  added_at: string;
}