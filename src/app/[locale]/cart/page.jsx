"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from "@/context/cartcontext";
import {useRouter} from "next/navigation";

const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="relative mb-8">
            <svg
                className="w-32 h-32 text-pink-400 opacity-80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <div className="absolute -inset-4 bg-pink-100 rounded-full blur-md opacity-30"></div>
        </div>
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
            Your cart is empty
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-md">
            Your shopping cart is waiting to be filled with beautiful things. Let's find something you'll love.
        </p>
        <a
            href="/"
            className="relative overflow-hidden group bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
            <span className="relative z-10">Discover Products</span>
            <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </a>
    </div>
);

const CartPage = () => {
    const { cart,updateCart,deleteCartItem } = useCart();

    const [currentCart, setCurrentCart] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const router = useRouter();

    const proceedToCheckout = ()=>{
        router.push("/checkout")
    }

    useEffect(() => {
        setCurrentCart(cart);
    }, [cart]);
    // useEffect(() => {
    //     setIsAnimating(true);
    //     const timer = setTimeout(() => setIsAnimating(false), 500);
    //     return () => clearTimeout(timer);
    // }, [currentCart?.lines.edges]);

    if (!currentCart || currentCart.lines.edges.length == 0) return <EmptyCart />;

    async function decreaseQuant(id, number) {
        await updateCart(id, number);
    }

    async function increaseQuant(id, number) {
        await updateCart(id, number);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4">
                        Your Shopping Cart
                    </h1>
                    <p className="text-lg text-gray-500 max-w-lg mx-auto">
                        Review your selections before checkout
                    </p>
                </div>

                <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
                    <div className="p-6 md:p-8 space-y-6">
                        {currentCart.lines.edges.map((item, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col md:flex-row items-center justify-between p-4 rounded-xl transition-all duration-300 €{
                                    isAnimating ? 'bg-pink-50' : 'hover:bg-pink-50'
                                }`}
                            >
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="relative">
                                        <img
                                            src={item.node.merchandise.product.featuredImage.url}
                                            alt={item.node.merchandise.product.title}
                                            className="w-28 h-28 rounded-xl object-cover shadow-md border border-pink-100"
                                        />
                                        <div className="absolute -inset-2 bg-pink-200 rounded-xl blur-md opacity-30 -z-10"></div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            {item.node.merchandise.product.title}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {item.node.merchandise.title}
                                        </p>
                                        <div className="flex items-center mt-3">
                                            <button className="text-pink-500 hover:text-pink-700 p-1" onClick={()=>decreaseQuant(item.node.id,item.node.quantity-1)} disabled={item.node.quantity == 1}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                                </svg>
                                            </button>
                                            <span className="mx-2 text-gray-700">{item.node.quantity}</span>
                                            <button className="text-pink-500 hover:text-pink-700 p-1" onClick={()=>increaseQuant(item.node.id,item.node.quantity+1)} disabled={item.node.quantity >= item.node.merchandise.quantityAvailable}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full md:w-auto mt-4 md:mt-0">
                                    <div className="text-pink-600 font-bold text-xl mr-8">
                                        €{(Number(item.node.merchandise.price.amount) * item.node.quantity).toFixed(2)}
                                    </div>
                                    <button className="text-gray-400 hover:text-pink-600 transition-colors" onClick={()=>deleteCartItem(item.node.id)}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50 p-6 md:p-8">
                        <div className="max-w-lg ml-auto space-y-6">
                            <div className="flex justify-between text-lg font-medium text-gray-700">
                                <span>Subtotal</span>
                                <span>€{currentCart.estimatedCost?.totalAmount?.amount}</span>
                            </div>
                            <div className="flex justify-between text-lg font-medium text-gray-700">
                                <span>Shipping</span>
                                <span className="text-pink-600">Free</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t border-pink-200">
                                <span>Total</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  €{currentCart.estimatedCost.totalAmount.amount}
                </span>
                            </div>

                            <button className="w-full group relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1" onClick={()=>proceedToCheckout()}>
                <span className="relative z-10 flex items-center justify-center">
                  Proceed to Checkout
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
                                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                            </button>

                            <div className="flex justify-center mt-4">
                                <a href="/" className="text-pink-600 hover:text-pink-800 font-medium flex items-center">
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                    </svg>
                                    Continue Shopping
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;