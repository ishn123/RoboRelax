"use client";
import { useCustomerOrders } from "@/hooks/useCustomer";

export default function OrdersPage() {
    const { orders, loading } = useCustomerOrders();


    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="text-center">
                <div className="animate-pulse text-2xl font-light text-rose-400/80 tracking-wide">
                    Unwrapping your treasures...
                </div>
                <div className="mt-2 h-1 w-32 mx-auto bg-gradient-to-r from-rose-100 to-rose-300 rounded-full animate-pulse"></div>
            </div>
        </div>
    );

    if (orders.length === 0) return (
        <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rose-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-xl font-medium text-rose-800/90 mb-2">Your pleasure cart is empty...</p>
            <p className="text-sm text-rose-600/80 max-w-md">Indulge yourself—explore our collection and treat your desires.</p>
        </div>
    );

    return (
        <div className="p-6 bg-gradient-to-br from-rose-50/50 to-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-light tracking-tight text-rose-900/90 mb-8 pb-2 border-b border-rose-200/60">
                    Your <span className="font-medium">Secret Purchases</span>
                </h2>

                <ul className="space-y-5">
                    {orders.map(((order,idx) => (
                        <li
                            key={order.id}
                            className="group relative border border-rose-200/50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-gradient-to-br hover:from-white hover:to-rose-50/30 overflow-hidden"
                        >
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-rose-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                <div>
                                    <p className="font-bold text-xl text-rose-900/90 mb-1 tracking-tight">
                                        Order <span className="font-black">#{order.orderNumber}</span>
                                    </p>
                                    <p className="text-sm text-rose-800/60">
                                        {new Date(order.processedAt).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                <span className="bg-gradient-to-r from-rose-200 to-rose-300 text-rose-900 px-4 py-1.5 rounded-full text-sm font-semibold shadow-inner">
                                    {order.totalPrice.amount} {order.totalPrice.currencyCode}
                                </span>
                            </div>

                            <a
                                href={order.statusUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative z-10 mt-5 inline-flex items-center text-rose-700 hover:text-rose-900 font-medium transition-all group-hover:translate-x-1"
                            >
                                Follow your pleasure
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </li>
                    )))}
                </ul>
            </div>
        </div>
    );
}