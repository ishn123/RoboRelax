'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiShoppingBag, FiHeart, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/authcontext';
import {useContext, useState} from "react";
import {useCart} from "@/context/cartcontext";

export default function UserDropdown() {
    const { user, isGuest, logout, setShowAuthModal } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const {saveCartBeforeUserLogoutIfExists} = useCart();

    return (
        <div className="relative">
            <button
                onClick={() => user || isGuest ? setIsOpen(!isOpen) : setShowAuthModal(true)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white">
                    {user || isGuest ? (
                        <span className="text-sm font-medium">
              {(user?.name || 'Guest').charAt(0).toUpperCase()}
            </span>
                    ) : (
                        <FiUser className="text-sm" />
                    )}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-xl shadow-lg border border-white/10 backdrop-blur-md overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-white/10">
                            <p className="text-sm text-white font-medium">
                                {user?.name || 'Guest User'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {user?.email || 'Shopping as guest'}
                            </p>
                        </div>

                        <div className="py-1">
                            {user ? (
                                <>
                                    <a
                                        href="/account"
                                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        <FiUser className="mr-3" />
                                        My Profile
                                    </a>
                                    <a
                                        href="/orders"
                                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        <FiShoppingBag className="mr-3" />
                                        My Orders
                                    </a>
                                    <a
                                        href="/wishlist"
                                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        <FiHeart className="mr-3" />
                                        Wishlist
                                    </a>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    <FiUser className="mr-3" />
                                    Login or Register
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    if (user || isGuest) {
                                        if(isGuest)logout();
                                        else saveCartBeforeUserLogoutIfExists().then(r=>logout());
                                    } else {
                                        setShowAuthModal(true);
                                    }
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-t border-white/10"
                            >
                                <FiLogOut className="mr-3" />
                                {user ? 'Sign Out' : isGuest ? 'Become a Member' : 'Login'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}