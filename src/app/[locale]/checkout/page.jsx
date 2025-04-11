"use client";
import { useState, useEffect } from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import { useMutation } from '@apollo/client';
import { useAuth } from '@/context/authcontext';
import { CREATE_CHECKOUT, CHECKOUT_LINE_ITEMS_ADD, shopifyClient,shopifyAdminClient } from '../../../lib/shopify';

export default function Checkout() {
    const router = useRouter();
    const variantId = useSearchParams().get("cid");
    const { user, login, register } = useAuth();
    const [mode, setMode] = useState('auth'); // 'auth' or 'checkout'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [createCheckout] = useMutation(CREATE_CHECKOUT,{client:shopifyClient});
    const [addLineItems] = useMutation(CHECKOUT_LINE_ITEMS_ADD, { client: shopifyClient });

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setMode('checkout');
        }
    }, [user]);

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let success;
            if (mode === 'login') {
                success = await login(email, password);
            } else if (mode === 'register') {
                success = await register(email, password, name);
            }

            if (success) {
                setMode('checkout');
            } else {
                setError('Authentication failed. Please try again.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Create checkout with authenticated user's email
            const { data: checkoutData } = await createCheckout({
                variables: {
                    input: {
                        email: user?.email || email,
                        lineItems: [{
                            variantId: variantId,
                            quantity: 1
                        }]
                    }
                }
            });

            if (checkoutData.checkoutCreate.checkoutUserErrors.length > 0) {
                throw new Error(checkoutData.checkoutCreate.checkoutUserErrors[0].message);
            }

            // Redirect to Shopify checkout
            window.location.href = checkoutData.checkoutCreate.checkout.webUrl;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (mode === 'auth') {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">
                    {mode === 'login' ? 'Login' : 'Register'} to Continue
                </h1>

                <form onSubmit={handleAuthSubmit}>
                    {mode === 'register' && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300 mb-4"
                    >
                        {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}
                    </button>

                    <p className="text-center">
                        {mode === 'login' ? (
                            <>Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('register')}
                                    className="text-blue-600 hover:underline"
                                >
                                    Register
                                </button>
                            </>
                        ) : (
                            <>Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('login')}
                                    className="text-blue-600 hover:underline"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </p>

                    {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <p className="mb-4">Logged in as: {user?.email || email}</p>

            <form onSubmit={handleCheckout}>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>

                {error && <p className="mt-4 text-red-500">{error}</p>}
            </form>
        </div>
    );
}