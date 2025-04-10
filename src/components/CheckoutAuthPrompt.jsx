'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutAuthPrompt({ onContinue }) {
    const { user, isGuest, setShowAuthModal } = useAuth();
    const [isVisible, setIsVisible] = useState(true);

    if (user || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl border border-white/10 backdrop-blur-md w-80">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-500/20 rounded-full">
                                <FiUser className="text-pink-400" />
                            </div>
                            <h3 className="font-bold text-white">Member Benefits</h3>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 rounded-full hover:bg-white/10"
                        >
                            <FiX className="text-gray-400" />
                        </button>
                    </div>

                    <ul className="space-y-2 mb-6 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                            <div className="text-pink-400 mt-0.5">•</div>
                            <span>Faster checkout experience</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="text-pink-400 mt-0.5">•</div>
                            <span>Order tracking and history</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="text-pink-400 mt-0.5">•</div>
                            <span>Exclusive member discounts</span>
                        </li>
                    </ul>

                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setShowAuthModal(true);
                                setIsVisible(false);
                            }}
                            className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            Join Now
                        </button>
                        <button
                            onClick={() => {
                                onContinue();
                                setIsVisible(false);
                            }}
                            className="flex-1 py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                            Continue <FiArrowRight />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}