'use client';

import { gql } from '@apollo/client';
import { shopifyClient } from '@/lib/shopify';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import ProductCard from './ProductCard';

const FEATURED_PRODUCTS_QUERY = gql`
    query GetFeaturedProducts($first: Int!) {
        products(first: $first) {
            edges {
                node {
                    id
                    title
                    description
                    featuredImage {
                        url
                    }
                    priceRange {
                        minVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                    variants(first: 1) {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef(null);

    // Parallax scroll effects
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
    const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await shopifyClient.query({
                    query: FEATURED_PRODUCTS_QUERY,
                    variables: { first: 8 }
                });
                setProducts(data.products.edges.map(edge => edge.node));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <section
            ref={sectionRef}
            className="relative py-32 overflow-hidden"
            style={{
                background: 'radial-gradient(ellipse at center, rgba(125, 35, 224, 0.1) 0%, rgba(0, 0, 0, 0) 70%)'
            }}
        >
            {/* Floating gradient blobs */}
            <motion.div
                className="absolute -top-80 -left-80 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl"
                style={{ y: y1 }}
            />
            <motion.div
                className="absolute -bottom-60 -right-60 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-pink-600/20 to-blue-600/20 blur-3xl"
                style={{ y: y2 }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
              Featured Collection
            </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Discover our most coveted pieces that blend luxury with irresistible style
                    </p>
                </motion.div>

                {/* Product grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                            className="relative group"
                        >
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-600/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />

                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>

                {/* View all button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <motion.a
                        href="/products"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-pink-500/30 transition-all"
                    >
                        View All Products
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}