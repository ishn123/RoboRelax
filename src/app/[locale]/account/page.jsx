'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser, FiMail, FiMapPin, FiShoppingBag,
    FiEdit, FiSave, FiX, FiChevronDown, FiChevronUp
} from 'react-icons/fi';

const ProfilePage = () => {
    const [user, setUser] = useState({
        name: 'Alex Johnson',
        email: 'alex@example.com',
        address: {
            street: '123 Fashion Ave',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'US'
        }
    });

    const [orders, setOrders] = useState([
        {
            id: '#1001',
            date: '2023-10-15',
            status: 'Delivered',
            total: '$149.99',
            items: [
                { name: 'Premium Sneakers', quantity: 1, price: '$129.99' },
                { name: 'Designer Socks', quantity: 2, price: '$10.00' }
            ]
        },
        // More orders...
    ]);

    const [activeTab, setActiveTab] = useState('orders');
    const [isEditing, setIsEditing] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    const slideUp = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="max-w-4xl mx-auto"
            >
                {/* Profile Header */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 sm:p-8 text-white">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center">
                                <FiUser className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                                <p className="text-pink-100">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex-1 py-4 font-medium flex items-center justify-center space-x-2 ${
                                activeTab === 'orders' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500'
                            }`}
                        >
                            <FiShoppingBag />
                            <span>My Orders</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('address')}
                            className={`flex-1 py-4 font-medium flex items-center justify-center space-x-2 ${
                                activeTab === 'address' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500'
                            }`}
                        >
                            <FiMapPin />
                            <span>Address</span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 sm:p-8">
                        {activeTab === 'orders' && (
                            <motion.div variants={slideUp} className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-800">Order History</h2>
                                {orders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        variants={slideUp}
                                        className="border border-gray-200 rounded-xl overflow-hidden"
                                    >
                                        <div className="p-4 bg-gray-50 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">Order {order.id}</p>
                                                <p className="text-sm text-gray-500">{order.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{order.total}</p>
                                                <p className={`text-sm ${
                                                    order.status === 'Delivered' ? 'text-green-500' : 'text-yellow-500'
                                                }`}>
                                                    {order.status}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                className="text-pink-500"
                                            >
                                                {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {expandedOrder === order.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 border-t border-gray-200">
                                                        <h3 className="font-medium mb-2">Items</h3>
                                                        <ul className="space-y-2">
                                                            {order.items.map((item, index) => (
                                                                <li key={index} className="flex justify-between">
                                                                    <span>{item.name} × {item.quantity}</span>
                                                                    <span>{item.price}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'address' && (
                            <motion.div variants={slideUp} className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800">Shipping Address</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-1 text-pink-500"
                                        >
                                            <FiEdit className="w-4 h-4" />
                                            <span>Edit</span>
                                        </button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex items-center space-x-1 text-gray-500"
                                            >
                                                <FiX className="w-4 h-4" />
                                                <span>Cancel</span>
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex items-center space-x-1 bg-pink-500 text-white px-3 py-1 rounded-lg"
                                            >
                                                <FiSave className="w-4 h-4" />
                                                <span>Save</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {!isEditing ? (
                                    <motion.div
                                        variants={slideUp}
                                        className="bg-gray-50 p-6 rounded-xl space-y-2"
                                    >
                                        <p className="font-medium">{user.address.street}</p>
                                        <p>{user.address.city}, {user.address.state} {user.address.zip}</p>
                                        <p className="text-gray-500">{user.address.country}</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                                                <input
                                                    type="text"
                                                    value={user.address.street}
                                                    onChange={(e) => setUser({...user, address: {...user.address, street: e.target.value}})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    value={user.address.city}
                                                    onChange={(e) => setUser({...user, address: {...user.address, city: e.target.value}})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                                <input
                                                    type="text"
                                                    value={user.address.state}
                                                    onChange={(e) => setUser({...user, address: {...user.address, state: e.target.value}})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    value={user.address.zip}
                                                    onChange={(e) => setUser({...user, address: {...user.address, zip: e.target.value}})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                                <select
                                                    value={user.address.country}
                                                    onChange={(e) => setUser({...user, address: {...user.address, country: e.target.value}})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                                >
                                                    <option value="US">United States</option>
                                                    <option value="CA">Canada</option>
                                                    <option value="UK">United Kingdom</option>
                                                    {/* Add more countries as needed */}
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;