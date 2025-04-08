'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { FiShoppingCart, FiHeart, FiChevronLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function ProductDetails({ product }) {
    const [selectedVariant, setSelectedVariant] = useState(product.variants.edges[0].node);
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
                <div className="sticky top-24">
                    <Link href="/products" className="flex items-center text-pink-500 mb-6 hover:underline">
                        <FiChevronLeft className="mr-1" /> Back to products
                    </Link>

                    <motion.div
                        className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={product.featuredImage?.url || '/placeholder-product.jpg'}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </motion.div>
                </div>
            </div>

            <div className="lg:w-1/2">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                    <div className="text-2xl font-bold text-pink-500 dark:text-pink-400 mb-6">
                        {selectedVariant.price.amount} {selectedVariant.price.currencyCode}
                    </div>

                    <div
                        className="prose dark:prose-invert mb-8"
                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />

                    {product.variants.edges.length > 1 && (
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Options</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.edges.map(({ node: variant }) => (
                                    <motion.button
                                        key={variant.id}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`px-4 py-2 rounded-full border ${
                                            variant.id === selectedVariant.id
                                                ? 'bg-pink-500 border-pink-500 text-white'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-pink-300'
                                        }`}
                                    >
                                        {variant.title}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-full"
                            >
                                -
                            </button>
                            <span className="px-4">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full"
                            >
                                +
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2"
                        >
                            <FiShoppingCart /> Add to Cart
                        </motion.button>

                        <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FiHeart />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}