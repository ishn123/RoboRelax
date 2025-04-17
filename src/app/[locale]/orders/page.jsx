'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiShoppingBag, FiChevronDown, FiChevronUp,
    FiExternalLink, FiTruck, FiCheckCircle,
    FiClock, FiXCircle, FiPackage
} from 'react-icons/fi';
import { gql } from "@apollo/client";
import { shopifyClient } from "@/lib/shopify";
import Image from 'next/image';
import Link from 'next/link';

const OrderTrackingPage = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    const slideUp = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'FULFILLED':
                return <FiCheckCircle className="text-green-500 mr-2" />;
            case 'IN_TRANSIT':
                return <FiTruck className="text-blue-500 mr-2" />;
            case 'PENDING':
                return <FiClock className="text-yellow-500 mr-2" />;
            case 'CANCELLED':
                return <FiXCircle className="text-red-500 mr-2" />;
            default:
                return <FiPackage className="text-gray-500 mr-2" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'FULFILLED':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'IN_TRANSIT':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getTrackingStatus = (order) => {
        // Simplified tracking status based on fulfillment status
        if (order.fulfillmentStatus === 'FULFILLED') {
            return {
                status: 'FULFILLED',
                steps: [
                    { id: 'ordered', name: 'Order placed', status: 'complete', date: order.processedAt },
                    { id: 'processed', name: 'Processed', status: 'complete', date: order.processedAt },
                    { id: 'shipped', name: 'Shipped', status: 'complete', date: order.processedAt },
                    { id: 'delivered', name: 'Delivered', status: 'complete', date: order.processedAt }
                ]
            };
        } else if (order.fulfillmentStatus === 'IN_TRANSIT') {
            return {
                status: 'IN_TRANSIT',
                steps: [
                    { id: 'ordered', name: 'Order placed', status: 'complete', date: order.processedAt },
                    { id: 'processed', name: 'Processed', status: 'complete', date: order.processedAt },
                    { id: 'shipped', name: 'Shipped', status: 'current', date: order.processedAt },
                    { id: 'delivered', name: 'Delivered', status: 'upcoming' }
                ]
            };
        } else if (order.fulfillmentStatus === 'CANCELLED') {
            return {
                status: 'CANCELLED',
                steps: [
                    { id: 'ordered', name: 'Order placed', status: 'complete', date: order.processedAt },
                    { id: 'cancelled', name: 'Cancelled', status: 'cancelled', date: order.processedAt }
                ]
            };
        } else {
            return {
                status: 'PENDING',
                steps: [
                    { id: 'ordered', name: 'Order placed', status: 'complete', date: order.processedAt },
                    { id: 'processed', name: 'Processing', status: 'current' },
                    { id: 'shipped', name: 'Shipping', status: 'upcoming' },
                    { id: 'delivered', name: 'Delivery', status: 'upcoming' }
                ]
            };
        }
    };

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const FETCH_ORDERS = gql`
                query GetCustomerOrders($customerAccessToken: String!) {
                    customer(customerAccessToken: $customerAccessToken) {
                        orders(first: 10, reverse: true) {
                            edges {
                                node {
                                    id
                                    orderNumber
                                    processedAt
                                    financialStatus
                                    fulfillmentStatus
                                    totalPrice {
                                        amount
                                        currencyCode
                                    }
                                    shippingAddress {
                                        name
                                        address1
                                        address2
                                        city
                                        province
                                        zip
                                        country
                                    }
                                    lineItems(first: 10) {
                                        edges {
                                            node {
                                                title
                                                quantity
                                                variant {
                                                    image {
                                                        url
                                                        altText
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    statusUrl
                                }
                            }
                        }
                    }
                }
            `;

            const { data } = await shopifyClient.query({
                query: FETCH_ORDERS,
                variables: { customerAccessToken: localStorage.getItem('auth_token') },
            });

            if (data.customer) {
                const formattedOrders = data.customer.orders.edges.map(edge => ({
                    id: edge.node.id,
                    orderNumber: edge.node.orderNumber,
                    date: formatDate(edge.node.processedAt),
                    financialStatus: edge.node.financialStatus,
                    fulfillmentStatus: edge.node.fulfillmentStatus,
                    total: `${edge.node.totalPrice.amount} ${edge.node.totalPrice.currencyCode}`,
                    items: edge.node.lineItems.edges.map(itemEdge => ({
                        name: itemEdge.node.title,
                        quantity: itemEdge.node.quantity,
                        image: itemEdge.node.variant?.image?.url || null,
                        altText: itemEdge.node.variant?.image?.altText || itemEdge.node.title
                    })),
                    shippingAddress: edge.node.shippingAddress,
                    statusUrl: edge.node.statusUrl
                }));

                setOrders(formattedOrders);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 dark:border-pink-400 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                        <FiXCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Error loading orders</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
                    <div className="mt-6">
                        <button
                            onClick={fetchOrders}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="max-w-4xl mx-auto"
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Orders</h1>
                    <Link
                        href="/account"
                        className="text-pink-600 dark:text-pink-400 hover:text-pink-500 dark:hover:text-pink-300 flex items-center"
                    >
                        Back to account
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        <div className="p-12 text-center">
                            <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No orders yet</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                You haven't placed any orders with us yet.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const tracking = getTrackingStatus(order);
                            return (
                                <motion.div
                                    key={order.id}
                                    variants={slideUp}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700"
                                >
                                    <div
                                        className="p-4 sm:p-6 cursor-pointer"
                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Placed on {order.date}
                                                </p>
                                                <div className="mt-2 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tracking.status)}`}>
                            {getStatusIcon(tracking.status)}
                              {tracking.status.replace('_', ' ')}
                          </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{order.total}</p>
                                                <button className="text-pink-600 dark:text-pink-400 hover:text-pink-500 dark:hover:text-pink-300 mt-2">
                                                    {expandedOrder === order.id ? (
                                                        <FiChevronUp className="h-5 w-5" />
                                                    ) : (
                                                        <FiChevronDown className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedOrder === order.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-5">
                                                    {/* Tracking Progress */}
                                                    <div className="mb-8">
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Order Status</h4>
                                                        <div className="overflow-hidden">
                                                            <nav aria-label="Progress">
                                                                <ol className="space-y-4">
                                                                    {tracking.steps.map((step, stepIdx) => (
                                                                        <li key={step.name} className="relative">
                                                                            <div className="flex items-start">
                                        <span className={`flex items-center justify-center h-9 ${stepIdx !== tracking.steps.length - 1 ? 'w-9' : 'w-9'}`}>
                                          {step.status === 'complete' ? (
                                              <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-pink-600 rounded-full">
                                              <FiCheckCircle className="w-5 h-5 text-white" />
                                            </span>
                                          ) : step.status === 'current' ? (
                                              <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-white border-2 border-pink-600 rounded-full">
                                              <span className="h-2.5 w-2.5 bg-pink-600 rounded-full" />
                                            </span>
                                          ) : step.status === 'cancelled' ? (
                                              <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-red-600 rounded-full">
                                              <FiXCircle className="w-5 w-5 text-white" />
                                            </span>
                                          ) : (
                                              <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full">
                                              <span className="h-2.5 w-2.5 bg-transparent rounded-full" />
                                            </span>
                                          )}
                                        </span>
                                                                                <div className="ml-4 min-w-0">
                                                                                    <h4 className={`text-xs font-semibold tracking-wide uppercase ${step.status === 'complete' ? 'text-pink-600 dark:text-pink-400' : step.status === 'current' ? 'text-pink-600 dark:text-pink-400' : step.status === 'cancelled' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                                                        {step.name}
                                                                                    </h4>
                                                                                    {step.date && (
                                                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                                            {formatDate(step.date)}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            {stepIdx !== tracking.steps.length - 1 ? (
                                                                                <div className="absolute top-9 left-4 w-0.5 h-10 bg-gray-200 dark:bg-gray-600" aria-hidden="true" />
                                                                            ) : null}
                                                                        </li>
                                                                    ))}
                                                                </ol>
                                                            </nav>
                                                        </div>
                                                    </div>

                                                    {/* Shipping Address */}
                                                    {order.shippingAddress && (
                                                        <div className="mb-8">
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Shipping Address</h4>
                                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {order.shippingAddress.name}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {order.shippingAddress.address1}
                                                                </p>
                                                                {order.shippingAddress.address2 && (
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {order.shippingAddress.address2}
                                                                    </p>
                                                                )}
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {order.shippingAddress.country}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Order Items */}
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Items</h4>
                                                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                                            {order.items.map((item, index) => (
                                                                <li key={index} className="py-4 flex">
                                                                    <div className="flex-shrink-0">
                                                                        {item.image ? (
                                                                            <Image
                                                                                src={item.image}
                                                                                alt={item.altText}
                                                                                width={80}
                                                                                height={80}
                                                                                className="rounded-md object-cover w-20 h-20"
                                                                                unoptimized
                                                                            />
                                                                        ) : (
                                                                            <div className="w-20 h-20 rounded-md bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                                                <FiPackage className="w-6 h-6 text-gray-400 dark:text-gray-300" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="ml-4 flex-1 flex flex-col sm:flex-row justify-between">
                                                                        <div className="flex-1">
                                                                            <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                                                                {item.name}
                                                                            </h5>
                                                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                                                Quantity: {item.quantity}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Order Actions */}
                                                    <div className="mt-6 flex flex-col sm:flex-row sm:justify-between">
                                                        <a
                                                            href={order.statusUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 mb-3 sm:mb-0"
                                                        >
                                                            <FiExternalLink className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                            View Order Details
                                                        </a>
                                                        <button
                                                            onClick={() => window.print()}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                                        >
                                                            Print Receipt
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default OrderTrackingPage;