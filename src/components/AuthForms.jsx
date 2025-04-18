'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiMail, FiLock, FiUser as FiName, FiMapPin, FiHome, FiNavigation, FiArrowRight } from 'react-icons/fi';
import {gql} from "@apollo/client";
import {shopifyClient} from "@/lib/shopify";

export default function AuthForms({ onLogin, onRegister, onForgotPassword, error }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (showForgotPassword) {
            onForgotPassword(email);
            return;
        }

        if (isLogin) {
            onLogin(email, password);
        } else {
            onRegister(email, password, name, street, city, state, zipCode);
        }
    };

    return (
        <>
            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-6">
                <button
                    onClick={() => {
                        setIsLogin(true);
                        setShowForgotPassword(false);
                    }}
                    className={`flex-1 py-3 text-center font-medium ${
                        isLogin && !showForgotPassword
                            ? 'text-pink-400 border-b-2 border-pink-500'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => {
                        setIsLogin(false);
                        setShowForgotPassword(false);
                    }}
                    className={`flex-1 py-3 text-center font-medium ${
                        !isLogin && !showForgotPassword
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

            {showForgotPassword ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-white mb-2">Reset Password</h2>
                        <p className="text-gray-400">Enter your email to receive a reset link</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div className="pt-2 flex justify-between">
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(false)}
                                className="text-pink-400 hover:text-pink-300 flex items-center"
                            >
                                <FiArrowRight className="rotate-180 mr-1" /> Back to login
                            </button>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-pink-500/30 transition-all"
                            >
                                Send Reset Link
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
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

                            {/* Address Fields */}
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="overflow-hidden space-y-4"
                            >
                                <h3 className="text-sm font-medium text-gray-400 mb-1 flex items-center">
                                    <FiMapPin className="mr-2" /> Address Information
                                </h3>

                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Street Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiHome className="text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            required={!isLogin}
                                            className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                            placeholder="123 Main St"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">City</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                required={!isLogin}
                                                className="w-full pl-3 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                                placeholder="City"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">State</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                required={!isLogin}
                                                className="w-full pl-3 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                                placeholder="State"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Zip Code</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiNavigation className="text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            value={zipCode}
                                            onChange={(e) => setZipCode(e.target.value)}
                                            required={!isLogin}
                                            className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                            placeholder="12345"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </>
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

                    {(
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
                            {isLogin && (
                            <div className="text-right mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-pink-400 hover:text-pink-300 text-sm"
                                >
                                    Forgot password?
                                </button>
                            </div>)}
                        </div>
                    )}

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
            )}
        </>
    );
}