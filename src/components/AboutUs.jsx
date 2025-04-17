'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FiAward, FiUsers, FiShoppingBag } from 'react-icons/fi';
import Image from "next/image";
import my_img from "../app/[locale]/My_main.jpg"

export default function AboutUs() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax effects
    const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
    const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 1]);

    return (
        <section
            ref={ref}
            className="relative py-32 overflow-hidden"
            style={{
                background: 'radial-gradient(ellipse at center, rgba(125, 35, 224, 0.15) 0%, rgba(0, 0, 0, 0) 70%)'
            }}
        >
            {/* Floating gradient elements */}
            <motion.div
                className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl"
                style={{ y: y1 }}
            />
            <motion.div
                className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-600/20 to-blue-600/20 blur-3xl"
                style={{ y: y2 }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-white/10">
                            {/* Replace with your actual image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-800 flex items-center justify-center text-white text-2xl">
                                <Image src={my_img}  alt="My Image" className="object-contain h-full w-full"/>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="absolute -bottom-8 -left-8 w-32 h-32 rounded-2xl bg-pink-600/20 backdrop-blur-sm border border-pink-500/30 z-10"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="absolute -top-8 -right-8 w-40 h-40 rounded-2xl bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 z-10"
                        />
                    </motion.div>

                    {/* Content section */}
                    <motion.div
                        style={{ opacity }}
                        className="space-y-8"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold"
                        >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                My Story
              </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-lg text-black-300"
                        >
                            Ich bin Ben Wegscheider, Unternehmer aus ganzer Leidenschaft. Mit diesem Massagesalon erfülle ich mir einen langersehnten Traum.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-lg text-black-300"
                        >
                            Ich freue mich, dass hiermit am 01 Mai 2025 der erster Roboter-Massagesalon seiner Art in ganz Europa eröffnen wird! - Im Herzen Münchens
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-3 gap-4 pt-8"
                        >
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                <div className="text-pink-400 mb-2">
                                    <FiAward className="text-3xl" />
                                </div>
                                <div className="text-3xl font-bold text-white">15+</div>
                                <div className="text-sm text-gray-400">Industry Awards</div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                <div className="text-purple-400 mb-2">
                                    <FiUsers className="text-3xl" />
                                </div>
                                <div className="text-3xl font-bold text-white">50K+</div>
                                <div className="text-sm text-gray-400">Happy Clients</div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                <div className="text-blue-400 mb-2">
                                    <FiShoppingBag className="text-3xl" />
                                </div>
                                <div className="text-3xl font-bold text-white">200+</div>
                                <div className="text-sm text-gray-400">Unique Products</div>
                            </div>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="pt-8"
                        >
                            <motion.a
                                href="/about"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-pink-500/30 transition-all"
                            >
                                Discover More
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}