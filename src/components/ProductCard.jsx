'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';

export default function ProductCard({ product }) {
    const pId = product.id.split("/").splice(-1)[0];
    const isInStock = product.variants?.edges?.[0]?.node?.availableForSale;

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ y: -5 }}
        >
            <Link href={`/products/${pId}`}>
                <div className="relative aspect-square">
                    <Image
                        src={product.featuredImage?.url || '/placeholder-product.jpg'}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {!isInStock && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            Out of Stock
                        </div>
                    )}
                    <button className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full hover:bg-pink-500 hover:text-white transition-colors">
                        <FiHeart className="w-5 h-5" />
                    </button>
                </div>
            </Link>

            <div className="p-4">
                <Link href={`/products/${pId}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-pink-500 transition-colors line-clamp-1">
                        {product.title}
                    </h3>
                </Link>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex justify-between items-center">
          <span className="font-bold text-pink-500 dark:text-pink-400">
            {product.priceRange.minVariantPrice.amount.split(".")[0]},00 {product.priceRange.minVariantPrice.currencyCode}
          </span>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-full transition-colors ${
                            isInStock ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-gray-400 text-white cursor-not-allowed'
                        }`}
                        disabled={!isInStock}
                        title={isInStock ? 'Add to cart' : 'Out of stock'}
                    >
                        <FiShoppingCart className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
