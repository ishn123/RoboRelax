'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiMail, FiLock, FiUser as FiName } from 'react-icons/fi';

export default function AuthForms({ onLogin, onRegister, error }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(email, password);
        } else {
            onRegister(email, password, name);
        }
    };

    return (
        <>
            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-6">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 text-center font-medium ${
                        isLogin
                            ? 'text-pink-400 border-b-2 border-pink-500'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 text-center font-medium ${
                        !isLogin
                            ? 'text-pink-400 border-b-2 border-pink-500'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Register
                </button>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg mb-6"
                >
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiName className="text-gray-500" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                                className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                placeholder="Your Name"
                            />
                        </div>
                    </motion.div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-500" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-gray-500" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-pink-500/30 transition-all"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </motion.button>
                </div>
            </form>
        </>
    );
}