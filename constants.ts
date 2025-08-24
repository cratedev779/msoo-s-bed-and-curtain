
import type { Product } from './types';

export const APP_NAME = "Msoo's Beddings and Curtains";
export const WHATSAPP_NUMBER = "+254700000000"; // Replace with actual number

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  twitter: "https://x.com",
  instagram: "https://instagram.com",
};

export const DELIVERY_LOCATIONS_KENYA = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Machakos", "Kiambu", "Kakamega", "Nyeri"
];


export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Luxury Velvet Curtains',
    description: 'Elegant blackout velvet curtains that add a touch of luxury to any room. Provides complete privacy and blocks out sunlight effectively.',
    price: 4500,
    imageUrl: 'https://picsum.photos/seed/curtain1/600/600',
    category: 'Curtains',
  },
  {
    id: '2',
    name: 'Egyptian Cotton Bedding Set',
    description: 'Experience ultimate comfort with our 800 thread count Egyptian cotton bedding set. Includes a duvet cover, a flat sheet, and two pillowcases.',
    price: 8999,
    imageUrl: 'https://picsum.photos/seed/bedding1/600/600',
    category: 'Beddings',
  },
  {
    id: '3',
    name: 'Bohemian Style Sheer Curtains',
    description: 'Light and airy sheer curtains with a beautiful bohemian pattern. Perfect for living rooms to allow natural light while adding a decorative touch.',
    price: 2500,
    imageUrl: 'https://picsum.photos/seed/curtain2/600/600',
    category: 'Curtains',
  },
  {
    id: '4',
    name: 'Silk Comforter Duvet Insert',
    description: 'Hypoallergenic and breathable silk comforter. Regulates temperature for comfortable sleep all year round.',
    price: 12000,
    imageUrl: 'https://picsum.photos/seed/bedding2/600/600',
    category: 'Beddings',
  },
    {
    id: '5',
    name: 'Linen Blend Curtains',
    description: 'A beautiful blend of linen and cotton for a rustic yet sophisticated look. Drapes beautifully and offers moderate light filtering.',
    price: 3800,
    imageUrl: 'https://picsum.photos/seed/curtain3/600/600',
    category: 'Curtains',
  },
  {
    id: '6',
    name: 'Microfiber Quilted Bedspread',
    description: 'Soft and durable microfiber bedspread with a classic quilted pattern. Lightweight and perfect for layering.',
    price: 5500,
    imageUrl: 'https://picsum.photos/seed/bedding3/600/600',
    category: 'Beddings',
  },
];