'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {useMemo} from "react";

export default function HeroSection() {
    const bubbles = useMemo(() =>
            [...Array(20)].map((_, i) => ({
                id: i,
                width: 100 + (i * 13 % 200), // Pseudo-random but deterministic
                height: 100 + (i * 17 % 200),
                top: (i * 23 % 100),
                left: (i * 29 % 100),
            }))
        , []);

    return (
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/hero-pattern.svg')] bg-[length:100px_100px] opacity-5 dark:opacity-[0.02]" />
                {bubbles.map((bubble) => (
                    <motion.div
                        key={bubble.id}
                        className="absolute rounded-full bg-pink-500/20 dark:bg-pink-400/10"
                        style={{
                            width: bubble.width,
                            height: bubble.height,
                            top: `${bubble.top}%`,
                            left: `${bubble.left}%`,
                        }}
                        animate={{
                            y: [0, (bubble.id * 7 % 50) - 25],
                            x: [0, (bubble.id * 11 % 50) - 25],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 10 + (bubble.id * 3 % 10),
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                        Your Wellness is our Passion
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10">
                        Discover cosmetics that enhance your natural radiance with our
                        carefully curated collection of premium beauty products.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/products"
                                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-pink-500/30 transition-all"
                            >
                                Shop Now
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}