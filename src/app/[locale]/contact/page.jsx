'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiSend, FiMail, FiMapPin, FiPhone, FiCheck } from 'react-icons/fi';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitState, setSubmitState] = useState('idle');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            return;
        }

        setSubmitState('submitting');

        try {
            // Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSubmitState('success');
            setFormData({ name: '', email: '', message: '' });

            // Reset after 2 seconds
            setTimeout(() => setSubmitState('idle'), 2000);
        } catch (error) {
            setSubmitState('idle');
            console.error('Submission error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                        Contact Us
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Have questions or want to collaborate? We'd love to hear from you!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Hello, I'd like to talk about..."
                                ></textarea>
                            </motion.div>

                            <div className="pt-2 h-14 relative">
                                <AnimatePresence mode="wait">
                                    {submitState === 'idle' ? (
                                        <motion.button
                                            key="submit-button"
                                            type="submit"
                                            initial={{ opacity: 1 }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.9,
                                                borderRadius: '12px' // Match initial border radius
                                            }}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="w-full h-full rounded-xl font-bold text-lg text-white bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg hover:shadow-pink-500/30 flex items-center justify-center gap-2"
                                        >
                                            <FiSend className="text-xl" />
                                            <span>Send Message</span>
                                        </motion.button>
                                    ) : submitState === 'submitting' ? (
                                        <motion.div
                                            key="submitting"
                                            initial={{
                                                scale: 0.9,
                                                opacity: 0,
                                                borderRadius: '12px'
                                            }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                                borderRadius: '9999px',
                                                width: '56px',
                                                backgroundColor: 'rgba(236, 72, 153, 0.8)'
                                            }}
                                            exit={{
                                                scale: 0.9,
                                                opacity: 0
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute left-1/2 top-0 -translate-x-1/2 h-full flex items-center justify-center"
                                        >
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                                className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="success"
                                            initial={{
                                                scale: 0.9,
                                                opacity: 0,
                                                borderRadius: '9999px',
                                                width: '56px',
                                                backgroundColor: 'rgba(16, 185, 129, 0.8)'
                                            }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                                backgroundColor: 'rgba(16, 185, 129, 1)'
                                            }}
                                            className="absolute left-1/2 top-0 -translate-x-1/2 h-full flex items-center justify-center rounded-full"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    delay: 0.1,
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 15
                                                }}
                                            >
                                                <FiCheck className="text-white text-2xl" />
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
                        >
                            <div className="p-3 bg-pink-500/20 rounded-full">
                                <FiMail className="text-pink-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
                                <p className="text-gray-300">hello@yourbrand.com</p>
                                <p className="text-gray-400 text-sm mt-1">Response within 24 hours</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
                        >
                            <div className="p-3 bg-purple-500/20 rounded-full">
                                <FiMapPin className="text-purple-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Our Location</h3>
                                <p className="text-gray-300">123 Design Street</p>
                                <p className="text-gray-300">San Francisco, CA 94107</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
                        >
                            <div className="p-3 bg-blue-500/20 rounded-full">
                                <FiPhone className="text-blue-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
                                <p className="text-gray-300">+1 (555) 123-4567</p>
                                <p className="text-gray-400 text-sm mt-1">Mon-Fri, 9am-5pm PST</p>
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                            className="flex gap-4 justify-center lg:justify-start"
                        >
                            {['Instagram', 'Twitter', 'LinkedIn'].map((social, index) => (
                                <motion.a
                                    key={social}
                                    href="#"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-3 bg-white/10 rounded-full backdrop-blur-md border border-white/10 hover:bg-pink-500/20 transition-colors"
                                    style={{ transitionDelay: `${0.5 + index * 0.1}s` }}
                                >
                                    <span className="sr-only">{social}</span>
                                    <span className="text-white">{social.charAt(0)}</span>
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}