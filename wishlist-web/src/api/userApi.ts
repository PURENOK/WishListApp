import api from './axiosInstance';
import { Wishlist } from '../types';

export const getWishlists = async (): Promise<Wishlist[]> => {
  const response = await api.get('/wishlists');
  return response.data;
};

export const createWishlist = (data: { title: string; description?: string; is_public?: boolean }) => 
  api.post('/wishlists', data);