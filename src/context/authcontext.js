'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiX, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForms from "@/components/AuthForms";



const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authStatus, setAuthStatus] = useState('idle');
    const [authError, setAuthError] = useState('');
    const router = useRouter();

    // Check for existing session on mount
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Verify token with your backend
            setUser({ id: '123', email: 'user@example.com', name: 'Existing User' });
        }
    }, []);

    const login = async (email, password) => {
        setAuthStatus('loading');
        try {
            // Replace with actual login API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const userData = { id: '123', email, name: 'Logged In User' };
            setUser(userData);
            localStorage.setItem('auth_token', 'generated_token_here');
            setAuthStatus('success');
            setIsGuest(false);

            setTimeout(() => {
                setShowAuthModal(false);
                router.refresh();
            }, 1000);
        } catch (error) {
            setAuthStatus('error');
            setAuthError(error.message);
        }
    };

    const register = async (email, password, name) => {
        setAuthStatus('loading');
        try {
            // Replace with actual registration API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const userData = { id: '456', email, name };
            setUser(userData);
            localStorage.setItem('auth_token', 'generated_token_here');
            setAuthStatus('success');
            setIsGuest(false);

            setTimeout(() => {
                setShowAuthModal(false);
                router.refresh();
            }, 1000);
        } catch (error) {
            setAuthStatus('error');
            setAuthError(error.message);
        }
    };

    const logout = () => {
        setUser(null);
        setIsGuest(false);
        localStorage.removeItem('auth_token');
        router.refresh();
    };

    const continueAsGuest = () => {
        setIsGuest(true);
        setShowAuthModal(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isGuest,
                login,
                register,
                logout,
                continueAsGuest,
                showAuthModal,
                setShowAuthModal
            }}
        >
            {children}

            {/* Sexy Auth Modal */}
            <AnimatePresence>
                {showAuthModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="relative w-full max-w-md"
                        >
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                <button
                                    onClick={() => setShowAuthModal(false)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <FiX className="text-white" />
                                </button>

                                <div className="p-8">
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                                            <FiUser className="text-white text-2xl" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {authStatus === 'success' ? 'Welcome!' : 'Join the Experience'}
                                        </h3>
                                        <p className="text-gray-400">
                                            {authStatus === 'success'
                                                ? 'You are now logged in'
                                                : 'Login or register for a personalized experience'}
                                        </p>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {authStatus === 'success' ? (
                                            <motion.div
                                                key="success"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-center py-8"
                                            >
                                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <FiCheck className="text-green-400 text-2xl" />
                                                </div>
                                                <p className="text-gray-300">You're all set!</p>
                                            </motion.div>
                                        ) : authStatus === 'loading' ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="text-center py-12"
                                            >
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
                                                />
                                                <p className="text-gray-400">Authenticating...</p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="form"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="space-y-6"
                                            >
                                                <AuthForms
                                                    onLogin={login}
                                                    onRegister={register}
                                                    error={authError}
                                                />

                                                <div className="pt-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={continueAsGuest}
                                                        className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                                                    >
                                                        Continue as Guest
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};