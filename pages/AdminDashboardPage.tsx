import React, { useState, ChangeEvent } from 'react';
import { useAdmin, useAuth } from '../contexts/AppContext';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { generateDescriptionWithGemini } from '../services/geminiService';
import type { Product, Order, User } from '../types';

type AdminView = 'products' | 'orders' | 'users' | 'profile';

const AdminProfile: React.FC = () => {
    const { user, changePassword } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (newPassword !== confirmPassword) {
            setMessage({type: 'error', text: 'Passwords do not match.'});
            return;
        }
        if (newPassword.length < 6) {
            setMessage({type: 'error', text: 'Password must be at least 6 characters long.'});
            return;
        }
        setIsLoading(true);
        const { success, error } = await changePassword(newPassword);
        if (success) {
            setMessage({type: 'success', text: 'Password updated successfully!'});
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setMessage({type: 'error', text: error || 'Failed to update password.'});
        }
        setIsLoading(false);
    };

    if (!user) return null;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Admin Profile</h2>
            <div className="bg-white shadow rounded-lg p-6 max-w-md">
                <p className="mb-2"><span className="font-semibold">Name:</span> {user.name}</p>
                <p className="mb-4"><span className="font-semibold">Email:</span> {user.email}</p>
                
                <form onSubmit={handleSubmit}>
                    <h3 className="text-lg font-semibold border-t pt-4">Change Password</h3>
                    {message && <p className={`text-sm p-2 rounded my-2 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</p>}
                    <div className="space-y-4 mt-4">
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" required className="w-full p-2 border rounded"/>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required className="w-full p-2 border rounded"/>
                    </div>
                    <div className="mt-4">
                        <Button type="submit" isLoading={isLoading}>Update Password</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// Helper component for managing products
const AdminProducts: React.FC<{ products: Product[]; onAdd: (p: Omit<Product, 'id'>) => void; onUpdate: (p: Product) => void; onDelete: (id: string) => void }> = 
({ products, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const openModal = (product: Partial<Product> | null = null) => {
        setCurrentProduct(product || { name: '', price: 0, description: '', category: 'Curtains' });
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };
    
    const handleGenerateDesc = async () => {
        if (!currentProduct?.name || !imageFile) {
            alert("Please provide a product name and image to generate a description.");
            return;
        }
        setIsGenerating(true);
        const desc = await generateDescriptionWithGemini(currentProduct.name, imageFile);
        setCurrentProduct(prev => ({...prev!, description: desc}));
        setIsGenerating(false);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!currentProduct?.name || !currentProduct?.price) return;
        
        // Note: Image upload to a service like Firebase Storage would be needed in a real app.
        // Here, we're still using local object URLs for simplicity.
        const imageUrl = imageFile ? URL.createObjectURL(imageFile) : currentProduct.imageUrl || 'https://picsum.photos/600/600';

        if(currentProduct.id) {
            onUpdate({ ...currentProduct, imageUrl } as Product);
        } else {
            const { id, ...newProductData } = currentProduct;
            onAdd({ ...newProductData, imageUrl } as Omit<Product, 'id'>);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Manage Products</h2>
                <Button onClick={() => openModal()}>Add Product</Button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(p => (
                            <tr key={p.id}>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><img src={p.imageUrl} className="h-10 w-10 rounded-md mr-4 object-cover" alt={p.name}/>{p.name}</div></td>
                                <td className="px-6 py-4 whitespace-nowrap">Ksh {p.price.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{p.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openModal(p)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentProduct?.id ? 'Edit Product' : 'Add Product'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Product Name" value={currentProduct?.name || ''} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} required className="w-full p-2 border rounded"/>
                    <input type="number" placeholder="Price" value={currentProduct?.price || ''} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} required className="w-full p-2 border rounded"/>
                    <select value={currentProduct?.category || 'Curtains'} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value as Product['category']})} className="w-full p-2 border rounded">
                        <option>Curtains</option>
                        <option>Beddings</option>
                    </select>
                    <textarea placeholder="Description" value={currentProduct?.description || ''} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} required rows={4} className="w-full p-2 border rounded"></textarea>
                    
                    <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm"/>
                    
                    <Button type="button" variant="secondary" onClick={handleGenerateDesc} isLoading={isGenerating}>Generate Description with AI</Button>
                    
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Product</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// Helper component for managing orders
const AdminOrders: React.FC<{ orders: Order[]; onUpdateStatus: (id: string, status: Order['status']) => void }> = ({ orders, onUpdateStatus }) => (
    <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
        <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(o => (
                        <tr key={o.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate" title={o.id}>{o.id.substring(0,8)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{o.user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ksh {o.total.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <select value={o.status} onChange={e => onUpdateStatus(o.id, e.target.value as Order['status'])} className="p-1 border rounded bg-white">
                                    <option>Processing</option>
                                    <option>Shipped</option>
                                    <option>Delivered</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                     {orders.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-4 text-gray-500">No orders found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// Helper component for viewing users
const AdminUsers: React.FC<{ users: User[] }> = ({ users }) => (
    <div>
        <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
        <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(u => (
                        <tr key={u.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{u.role}</td>
                        </tr>
                    ))}
                     {users.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-4 text-gray-500">No users found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);


const AdminDashboardPage: React.FC = () => {
    const [view, setView] = useState<AdminView>('products');
    const { products, orders, users, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useAdmin();

    const renderView = () => {
        switch (view) {
            case 'products':
                return <AdminProducts products={products} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} />;
            case 'orders':
                return <AdminOrders orders={orders} onUpdateStatus={updateOrderStatus} />;
            case 'users':
                return <AdminUsers users={users} />;
            case 'profile':
                return <AdminProfile />;
            default:
                return null;
        }
    };
    
    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-serif font-bold text-primary mb-8">Admin Dashboard</h1>
            <div className="flex border-b mb-6">
                {(['products', 'orders', 'users', 'profile'] as AdminView[]).map(v => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`capitalize py-2 px-4 text-lg transition-colors duration-200 ${view === v ? 'border-b-2 border-primary font-semibold text-primary' : 'text-gray-500 hover:text-primary'}`}
                    >
                        {v}
                    </button>
                ))}
            </div>
            <div>{renderView()}</div>
        </div>
    );
};

export default AdminDashboardPage;