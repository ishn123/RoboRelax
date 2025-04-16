"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cartcontext';
import { useMutation } from '@apollo/client';
import {CREATE_CHECKOUT, shopifyClient} from "@/lib/shopify";

export default function CheckoutPage() {
    const router = useRouter();
    const { cart: currentCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [createCheckout, { data, loading: mutationLoading, error: mutationError }] = useMutation(CREATE_CHECKOUT);

    const handleCheckout = async () => {
        if (!currentCart?.id) {
            setError('Your cart is empty');
            return;
        }

        setLoading(true);
        setError(null);
        console.log(currentCart)
        try {
            // Create Shopify checkout with the cart ID
            const { data } = await createCheckout({
                variables: {
                    input: {
                        lines: currentCart.lines.edges
                            .filter(({ node }) => node?.merchandise?.id) // skip nulls
                            .map(({ node }) => ({
                                merchandiseId: node.merchandise.id,
                                quantity: node.quantity,
                            }))
                    }
                }
            });


            console.log(data)
            if (currentCart?.checkoutUrl) {
                // Redirect to Shopify's checkout page
                window.location.href = currentCart?.checkoutUrl;
            } else {
                throw new Error('Failed to create checkout');
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                            Secure Checkout
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Almost there! Review your order below
                        </p>
                    </div>

                    <div className="mb-6 space-y-4 max-h-64 overflow-y-auto pr-2">
                        {currentCart?.lines?.edges?.map(({ node }, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={node.merchandise.product.featuredImage.url}
                                        alt={node.merchandise.product.title}
                                        className="w-12 h-12 rounded-lg object-cover border border-pink-100"
                                    />
                                    <div>
                                        <h3 className="font-medium text-gray-800">{node.merchandise.product.title}</h3>
                                        <p className="text-sm text-gray-500">Qty: {node.quantity}</p>
                                    </div>
                                </div>
                                <div className="font-bold text-pink-600">
                                    ${(Number(node.merchandise.price.amount) * node.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-700">Order Total</span>
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                ${currentCart?.estimatedCost?.totalAmount?.amount || '0.00'}
              </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Taxes and shipping calculated at checkout
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading || !currentCart}
                        className="w-full group relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:from-pink-600 hover:to-purple-700 disabled:opacity-70"
                    >
            <span className="relative z-10 flex items-center justify-center">
              {loading ? (
                  <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                  <>
                      Proceed to Secure Checkout
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                  </>
              )}
            </span>
                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                    </button>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>You'll be redirected to Shopify's secure checkout</p>
                    </div>
                </div>
            </div>
        </div>
    );
}