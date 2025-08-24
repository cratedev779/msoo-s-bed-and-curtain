export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Curtains' | 'Beddings';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}

export interface Order {
  id: string;
  user: User;
  items: CartItem[];
  total: number;
  deliveryLocation: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  date: any; // Firestore Timestamp
}