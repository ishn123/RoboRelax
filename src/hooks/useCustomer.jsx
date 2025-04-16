"use client";
import { useEffect, useState } from "react";
import {GET_CUSTOMER_ORDERS, shopifyClient} from "@/lib/shopify";
import {useAuth} from "@/context/authcontext";

export function useCustomerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    const [customerToken,setCustomerToken] = useState(null);

    useEffect(() => {
        if(!user)return;
        const token = localStorage.getItem('auth_token');
        setCustomerToken(token);
    }, [user]);



    useEffect(() => {
        if(!customerToken)return;
        async function fetchOrders() {

            const {data} = await shopifyClient.query({
                query:GET_CUSTOMER_ORDERS,
                variables:{customerAccessToken:customerToken}
            })


            setOrders(data?.customer?.orders.edges || []);
            setLoading(false);
        }

        if (customerToken) fetchOrders();
    }, [customerToken]);

    return { orders, loading };
}
