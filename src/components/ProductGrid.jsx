'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    transition={{ delay: index * 0.1 }}
                >
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </div>
    );
}