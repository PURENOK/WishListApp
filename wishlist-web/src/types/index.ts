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
  title: string;
  url?: string;
  price: number;
  currency: string;
  is_purchased: boolean;
  priority: number;
  image_url?: string;
}