import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import type { Product, CartItem, User, Order } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { auth, db } from '../firebaseConfig';
import { 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    updatePassword,
    type User as FirebaseUser
} from 'firebase/auth';
import { 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc,
    deleteDoc, 
    query, 
    orderBy,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';

const ADMIN_EMAILS = ['rahabnjenga53@gmail.com', 'sammymuigai131@gmail.com'];

// STATE
interface AppState {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  users: User[];
  orders: Order[];
  isLoading: boolean;
}

const initialState: AppState = {
  products: [],
  cart: [],
  user: null,
  users: [],
  orders: [],
  isLoading: true,
};

// ACTIONS
type Action =
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: { id: string } }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string, status: Order['status'] } };

// REDUCER
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_ORDERS':
        return { ...state, orders: action.payload };
    case 'SET_USERS':
        return { ...state, users: action.payload };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload.id) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ).filter(item => item.quantity > 0),
      };
    case 'CLEAR_CART':
        return {...state, cart: []};
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload.id) };
    case 'ADD_ORDER':
        return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER_STATUS':
        return {
            ...state,
            orders: state.orders.map(o => o.id === action.payload.id ? {...o, status: action.payload.status} : o)
        };
    default:
      return state;
  }
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const fetchProductsAndSeed = async () => {
        const productsCol = collection(db, 'products');
        const productSnapshot = await getDocs(productsCol);
        if (productSnapshot.empty) {
            // Seed the database if it's empty
            const batch = writeBatch(db);
            MOCK_PRODUCTS.forEach(product => {
                const docRef = doc(productsCol); // Firestore generates ID
                batch.set(docRef, { ...product, id: docRef.id });
            });
            await batch.commit();
            const seededProducts = MOCK_PRODUCTS.map((p, i) => ({...p, id: productSnapshot.docs[i]?.id || String(i+1)}));
            dispatch({ type: 'SET_PRODUCTS', payload: seededProducts });

        } else {
            const productList = productSnapshot.docs.map(doc => ({...doc.data(), id: doc.id } as Product));
            dispatch({ type: 'SET_PRODUCTS', payload: productList });
        }
    };
    fetchProductsAndSeed();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userRef);
            if(userSnap.exists()){
                const userData = userSnap.data() as User;
                dispatch({ type: 'SET_USER', payload: { ...userData, id: firebaseUser.uid } });
            }
        } else {
            dispatch({ type: 'SET_USER', payload: null });
        }
        dispatch({ type: 'SET_IS_LOADING', payload: false });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
      // Fetch admin-specific data
      if (state.user?.role === 'admin') {
          const fetchAdminData = async () => {
              // Fetch all orders
              const ordersQuery = query(collection(db, 'orders'), orderBy('date', 'desc'));
              const ordersSnapshot = await getDocs(ordersQuery);
              const ordersList = ordersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
              dispatch({ type: 'SET_ORDERS', payload: ordersList });
              // Fetch all users
              const usersSnapshot = await getDocs(collection(db, 'users'));
              const usersList = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
              dispatch({ type: 'SET_USERS', payload: usersList });
          };
          fetchAdminData();
      } else {
          dispatch({ type: 'SET_ORDERS', payload: [] });
          dispatch({ type: 'SET_USERS', payload: [] });
      }
  }, [state.user]);


  useEffect(() => {
      try {
        const localCart = localStorage.getItem('msooCart');
        if(localCart) {
            const parsedCart: CartItem[] = JSON.parse(localCart);
            parsedCart.forEach(item => {
                const { quantity, ...product } = item;
                for (let i = 0; i < quantity; i++) {
                    dispatch({ type: 'ADD_TO_CART', payload: product });
                }
            });
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        localStorage.removeItem('msooCart');
      }
  }, []);

  useEffect(() => {
    localStorage.setItem('msooCart', JSON.stringify(state.cart));
  }, [state.cart]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

// CUSTOM HOOKS
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

export const useCart = () => {
  const { state, dispatch } = useAppContext();
  const { cart } = state;

  const addToCart = (product: Product) => dispatch({ type: 'ADD_TO_CART', payload: product });
  const removeFromCart = (id: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  const updateQuantity = (id: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount };
};

export const useAuth = () => {
    const { state } = useAppContext();
    const { user } = state;

    const login = async (email: string, pass: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const userRef = doc(db, 'users', userCredential.user.uid);
            const userSnap = await getDoc(userRef);
            if(userSnap.exists()){
                return { user: userSnap.data() as User, error: null };
            }
            return { user: null, error: 'User data not found.' };
        } catch (error: any) {
            return { user: null, error: error.message };
        }
    };
    
    const signup = async (details: Omit<User, 'id' | 'role'> & {password: string}) => {
        const isAdminSignup = ADMIN_EMAILS.includes(details.email.toLowerCase());
        if (isAdminSignup && details.password !== 'Acces465#') {
            return { success: false, error: "Admin accounts must use the initial designated password for setup." };
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, details.email, details.password);
            const newUser: User = {
                id: userCredential.user.uid,
                name: details.name,
                email: details.email,
                phone: details.phone,
                role: isAdminSignup ? 'admin' : 'customer'
            };
            await setDoc(doc(db, 'users', newUser.id), newUser);
            return { success: true, error: null };
        } catch (error: any) {
             return { success: false, error: error.message };
        }
    };

    const logout = async () => await signOut(auth);

    const changePassword = async (newPassword: string) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                await updatePassword(currentUser, newPassword);
                return { success: true, error: null };
            } catch (error: any) {
                return { success: false, error: error.message };
            }
        }
        return { success: false, error: "No authenticated user found." };
    };

    return { user, login, signup, logout, changePassword };
};

export const useAdmin = () => {
    const { state, dispatch } = useAppContext();
    const { products, orders, users } = state;

    const addProduct = async (product: Omit<Product, 'id'>) => {
        const docRef = await addDoc(collection(db, "products"), product);
        const newProduct = { ...product, id: docRef.id };
        dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    };

    const updateProduct = async (product: Product) => {
        const productRef = doc(db, "products", product.id);
        await updateDoc(productRef, product);
        dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    };

    const deleteProduct = async (id: string) => {
        await deleteDoc(doc(db, "products", id));
        dispatch({ type: 'DELETE_PRODUCT', payload: { id } });
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        const orderRef = doc(db, 'orders', id);
        await updateDoc(orderRef, { status });
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
    };

    return { products, orders, users, addProduct, updateProduct, deleteProduct, updateOrderStatus };
};

export const useProducts = () => {
    const { state } = useAppContext();
    return state.products;
}

export const useCheckout = () => {
    const { dispatch } = useAppContext();
    
    const createOrder = async (orderData: Omit<Order, 'id'|'date'>) => {
        const newOrderData = {
            ...orderData,
            date: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "orders"), newOrderData);
        dispatch({ type: 'ADD_ORDER', payload: { ...orderData, id: docRef.id, date: new Date() } });
    }

    return { createOrder };
}