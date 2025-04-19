'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser, FiMail, FiMapPin, FiShoppingBag,
    FiEdit, FiSave, FiX, FiChevronDown, FiChevronUp,
    FiExternalLink, FiImage, FiPlus, FiStar, FiCheck, FiSettings,FiLock
} from 'react-icons/fi';
import { gql } from "@apollo/client";
import { shopifyClient } from "@/lib/shopify";
import Image from 'next/image';

const ProfilePage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState({
        firstName: '',
        email: '',
        addresses: [] // Now stores all addresses
    });
    const [defaultAddressId, setDefaultAddressId] = useState(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);

    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null); // Track which address is being edited
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
    const [addressError, setAddressError] = useState(null);
    const [addressSuccess, setAddressSuccess] = useState(null);

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        document.documentElement.classList.toggle('dark');
    };

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID':
            case 'FULFILLED':
                return 'text-green-500 dark:text-green-400';
            case 'PENDING':
                return 'text-yellow-500 dark:text-yellow-400';
            default:
                return 'text-gray-500 dark:text-gray-400';
        }
    };

    const fetchCustomerData = async () => {
        try {
            setIsLoading(true);
            const FETCH_CUSTOMER = gql`
                query GetCustomerOrders($customerAccessToken: String!) {
                    customer(customerAccessToken: $customerAccessToken) {
                        firstName
                        email
                        defaultAddress {
                            id
                        }
                        addresses(first: 10) {
                            edges {
                                node {
                                    id
                                    address1
                                    address2
                                    city
                                    province
                                    zip
                                    country
                                    countryCodeV2
                                }
                            }
                        }
                        orders(first: 10, reverse: true) {
                            edges {
                                node {
                                    orderNumber
                                    processedAt
                                    financialStatus
                                    fulfillmentStatus
                                    totalPrice {
                                        amount
                                        currencyCode
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
                query: FETCH_CUSTOMER,
                variables: { customerAccessToken: localStorage.getItem('auth_token') },
            });

            if (data.customer) {
                const customer = data.customer;
                const addresses = customer.addresses.edges.map(edge => ({
                    id: edge.node.id,
                    street: edge.node.address1 || '',
                    street2: edge.node.address2 || '',
                    city: edge.node.city || '',
                    state: edge.node.province || '',
                    zip: edge.node.zip || '',
                    country: edge.node.country || '',
                    countryCode: edge.node.countryCodeV2 || 'US'
                }));

                setUser({
                    firstName: customer.firstName,
                    email: customer.email,
                    addresses
                });

                setDefaultAddressId(customer.defaultAddress?.id ||
                    (addresses.length > 0 ? addresses[0].id : null));

                const formattedOrders = customer.orders.edges.map(edge => ({
                    id: `#${edge.node.orderNumber}`,
                    date: formatDate(edge.node.processedAt),
                    status: edge.node.fulfillmentStatus || edge.node.financialStatus,
                    financialStatus: edge.node.financialStatus,
                    fulfillmentStatus: edge.node.fulfillmentStatus,
                    total: `${edge.node.totalPrice.amount} ${edge.node.totalPrice.currencyCode}`,
                    items: edge.node.lineItems.edges.map(itemEdge => ({
                        name: itemEdge.node.title,
                        quantity: itemEdge.node.quantity,
                        image: itemEdge.node.variant?.image?.url || null,
                        altText: itemEdge.node.variant?.image?.altText || itemEdge.node.title
                    })),
                    statusUrl: edge.node.statusUrl
                }));

                setOrders(formattedOrders);
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAddress = async (addressData) => {
        try {
            setIsUpdatingAddress(true);
            setAddressError(null);
            setAddressSuccess(null);

            const UPDATE_ADDRESS = gql`
                mutation customerAddressUpdate(
                    $address: MailingAddressInput!
                    $customerAccessToken: String!
                    $id: ID!
                ) {
                    customerAddressUpdate(
                        address: $address
                        customerAccessToken: $customerAccessToken
                        id: $id
                    ) {
                        customerAddress {
                            id
                        }
                        customerUserErrors {
                            code
                            field
                            message
                        }
                    }
                }
            `;

            const CREATE_ADDRESS = gql`
                mutation customerAddressCreate(
                    $address: MailingAddressInput!
                    $customerAccessToken: String!
                ) {
                    customerAddressCreate(
                        address: $address
                        customerAccessToken: $customerAccessToken
                    ) {
                        customerAddress {
                            id
                        }
                        customerUserErrors {
                            code
                            field
                            message
                        }
                    }
                }
            `;

            const SET_DEFAULT_ADDRESS = gql`
                mutation customerDefaultAddressUpdate(
                    $addressId: ID!
                    $customerAccessToken: String!
                ) {
                    customerDefaultAddressUpdate(
                        addressId: $addressId
                        customerAccessToken: $customerAccessToken
                    ) {
                        customer {
                            id
                        }
                        customerUserErrors {
                            code
                            field
                            message
                        }
                    }
                }
            `;

            const addressInput = {
                address1: addressData.street,
                address2: addressData.street2,
                city: addressData.city,
                province: addressData.state,
                zip: addressData.zip,
                country: addressData.country
            };

            let response;
            if (addressData.id) {
                // Update existing address
                response = await shopifyClient.mutate({
                    mutation: UPDATE_ADDRESS,
                    variables: {
                        address: addressInput,
                        customerAccessToken: localStorage.getItem('auth_token'),
                        id: addressData.id
                    }
                });
            } else {
                // Create new address
                response = await shopifyClient.mutate({
                    mutation: CREATE_ADDRESS,
                    variables: {
                        address: addressInput,
                        customerAccessToken: localStorage.getItem('auth_token')
                    }
                });

                // Set as default if it's the first address
                if (user.addresses.length === 0) {
                    await shopifyClient.mutate({
                        mutation: SET_DEFAULT_ADDRESS,
                        variables: {
                            addressId: response.data.customerAddressCreate.customerAddress.id,
                            customerAccessToken: localStorage.getItem('auth_token')
                        }
                    });
                }
            }

            const errors = response.data?.customerAddressUpdate?.customerUserErrors ||
                response.data?.customerAddressCreate?.customerUserErrors;

            if (errors && errors.length > 0) {
                setAddressError(errors[0].message);
            } else {
                setAddressSuccess('Address successfully saved!');
                setIsEditing(false);
                setEditingAddress(null);
                // Immediately refresh the address list
                await fetchCustomerData();
            }
        } catch (error) {
            console.error('Error updating address:', error);
            setAddressError('Failed to update address. Please try again.');
        } finally {
            setIsUpdatingAddress(false);
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        try {
            setIsUpdatingAddress(true);
            setAddressError(null);

            const SET_DEFAULT_ADDRESS = gql`
                mutation customerDefaultAddressUpdate(
                    $addressId: ID!
                    $customerAccessToken: String!
                ) {
                    customerDefaultAddressUpdate(
                        addressId: $addressId
                        customerAccessToken: $customerAccessToken
                    ) {
                        customer {
                            id
                        }
                        customerUserErrors {
                            code
                            field
                            message
                        }
                    }
                }
            `;

            const response = await shopifyClient.mutate({
                mutation: SET_DEFAULT_ADDRESS,
                variables: {
                    addressId,
                    customerAccessToken: localStorage.getItem('auth_token')
                }
            });

            const errors = response.data?.customerDefaultAddressUpdate?.customerUserErrors;

            if (errors && errors.length > 0) {
                setAddressError(errors[0].message);
            } else {
                setDefaultAddressId(addressId);
                setAddressSuccess('Default address updated successfully!');
                // Immediately refresh to ensure consistency
                await fetchCustomerData();
            }
        } catch (error) {
            console.error('Error setting default address:', error);
            setAddressError('Failed to set default address. Please try again.');
        } finally {
            setIsUpdatingAddress(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            if (window.confirm('Are you sure you want to delete this address?')) {
                setIsUpdatingAddress(true);
                setAddressError(null);

                const DELETE_ADDRESS = gql`
                    mutation customerAddressDelete(
                        $customerAccessToken: String!
                        $id: ID!
                    ) {
                        customerAddressDelete(
                            customerAccessToken: $customerAccessToken
                            id: $id
                        ) {
                            deletedCustomerAddressId
                            customerUserErrors {
                                code
                                field
                                message
                            }
                        }
                    }
                `;

                const response = await shopifyClient.mutate({
                    mutation: DELETE_ADDRESS,
                    variables: {
                        id: addressId,
                        customerAccessToken: localStorage.getItem('auth_token')
                    }
                });

                const errors = response.data?.customerAddressDelete?.customerUserErrors;

                if (errors && errors.length > 0) {
                    setAddressError(errors[0].message);
                } else {
                    setAddressSuccess('Address deleted successfully!');
                    // Immediately refresh the address list
                    await fetchCustomerData();
                    // Reset default address if we deleted it
                    if (addressId === defaultAddressId) {
                        setDefaultAddressId(user.addresses.length > 1 ? user.addresses[0].id : null);
                    }
                }
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            setAddressError('Failed to delete address. Please try again.');
        } finally {
            setIsUpdatingAddress(false);
        }
    };

    const handleChangePassword = async () => {
        try {
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                setPasswordError("New passwords don't match");
                return;
            }

            setPasswordError(null);
            setPasswordSuccess(null);

            const UPDATE_PASSWORD = gql`
                mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
                    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
                        customer {
                            id
                        }
                        customerAccessToken {
                            accessToken
                            expiresAt
                        }
                        customerUserErrors {
                            code
                            field
                            message
                        }
                    }
                }
            `;

            const response = await shopifyClient.mutate({
                mutation: UPDATE_PASSWORD,
                variables: {
                    customerAccessToken: localStorage.getItem('auth_token'),
                    customer: {
                        password: passwordForm.newPassword
                    }
                }
            });

            const errors = response.data?.customerUpdate?.customerUserErrors;

            if (errors && errors.length > 0) {
                setPasswordError(errors[0].message);
            } else {
                setPasswordSuccess('Password updated successfully!');
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                const newToken = response?.data?.customerUpdate?.customerAccessToken.accessToken;
                localStorage.setItem('auth_token', newToken);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setPasswordError('Failed to update password. Please try again.');
        }
    };

    useEffect(() => {
        fetchCustomerData();
        // Check for saved theme preference or system preference
        const isDark = localStorage.getItem('darkMode') === 'true' ||
            (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 dark:border-pink-400 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="max-w-4xl mx-auto"
            >
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 sm:p-8 text-white">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center">
                                <FiUser className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">{user.firstName}</h1>
                                <p className="text-pink-100 dark:text-pink-200">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex-1 py-4 font-medium flex items-center justify-center space-x-2 ${
                                activeTab === 'orders'
                                    ? 'text-pink-500 dark:text-pink-400 border-b-2 border-pink-500 dark:border-pink-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <FiShoppingBag/>
                            <span>My Orders</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('address')}
                            className={`flex-1 py-4 font-medium flex items-center justify-center space-x-2 ${
                                activeTab === 'address'
                                    ? 'text-pink-500 dark:text-pink-400 border-b-2 border-pink-500 dark:border-pink-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <FiMapPin/>
                            <span>Addresses</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`flex-1 py-4 font-medium flex items-center justify-center space-x-2 ${
                                activeTab === 'account'
                                    ? 'text-pink-500 dark:text-pink-400 border-b-2 border-pink-500 dark:border-pink-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <FiSettings/>
                            <span>Account</span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 sm:p-8 text-gray-800 dark:text-gray-200">
                        {activeTab === 'orders' && (
                            <motion.div variants={slideUp} className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Order History</h2>
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <motion.div
                                            key={order.id}
                                            variants={slideUp}
                                            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-700"
                                        >
                                            <div className="p-4 flex justify-between items-center">
                                                <div className="text-gray-700 dark:text-gray-300">
                                                    <p className="font-medium">{order.id}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-800 dark:text-gray-100">{order.total}</p>
                                                    <p className={`text-sm ${getStatusColor(order.financialStatus)}`}>
                                                        {order.financialStatus}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <a
                                                        href={order.statusUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400"
                                                        title="View order status"
                                                    >
                                                        <FiExternalLink />
                                                    </a>
                                                    <button
                                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                        className="text-pink-500 dark:text-pink-400"
                                                    >
                                                        {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
                                                    </button>
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
                                                        <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    <h3 className="font-medium mb-1 text-gray-800 dark:text-gray-100">Items</h3>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-300">
                                                                        Status: {order.fulfillmentStatus || order.financialStatus}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <ul className="space-y-4">
                                                                {order.items.map((item, index) => (
                                                                    <li key={index} className="flex items-start space-x-4">
                                                                        <div className="flex-shrink-0">
                                                                            {item.image ? (
                                                                                <Image
                                                                                    src={item.image}
                                                                                    alt={item.altText}
                                                                                    width={80}
                                                                                    height={80}
                                                                                    className="rounded-lg object-cover w-20 h-20"
                                                                                    unoptimized
                                                                                />
                                                                            ) : (
                                                                                <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-500 flex items-center justify-center">
                                                                                    <FiImage className="w-6 h-6 text-gray-400 dark:text-gray-300" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-gray-700 dark:text-gray-300 font-medium truncate">
                                                                                {item.name}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                                Quantity: {item.quantity}
                                                                            </p>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">You haven't placed any orders yet</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                        {activeTab === 'address' && (
                            <motion.div variants={slideUp} className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                        {user.addresses.length > 0 ? 'Your Addresses' : 'Add Your First Address'}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setEditingAddress({
                                                street: '',
                                                street2: '',
                                                city: '',
                                                state: '',
                                                zip: '',
                                                country: 'US',
                                                countryCode: 'US'
                                            });
                                            setIsEditing(true);
                                        }}
                                        className="flex items-center space-x-1 text-pink-500 dark:text-pink-400"
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        <span>Add New</span>
                                    </button>
                                </div>

                                {addressError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg"
                                    >
                                        {addressError}
                                    </motion.div>
                                )}

                                {addressSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg"
                                    >
                                        {addressSuccess}
                                    </motion.div>
                                )}

                                {!isEditing ? (
                                    <div className="space-y-4">
                                        {user.addresses.length > 0 ? (
                                            user.addresses.map((address) => (
                                                <div
                                                    key={address.id}
                                                    className={`border rounded-xl overflow-hidden bg-white dark:bg-gray-700 ${
                                                        address.id === defaultAddressId
                                                            ? 'border-pink-500 dark:border-pink-400'
                                                            : 'border-gray-200 dark:border-gray-600'
                                                    }`}
                                                >
                                                    <div className="p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                {address.id === defaultAddressId && (
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 mb-2">
                                    <FiStar className="mr-1" /> Default
                                  </span>
                                                                )}
                                                                <p className="font-medium text-gray-800 dark:text-gray-100">{address.street}</p>
                                                                {address.street2 && (
                                                                    <p className="text-gray-700 dark:text-gray-300">{address.street2}</p>
                                                                )}
                                                                <p className="text-gray-700 dark:text-gray-300">{address.city}, {address.state} {address.zip}</p>
                                                                <p className="text-gray-500 dark:text-gray-400">{address.country}</p>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingAddress(address);
                                                                        setIsEditing(true);
                                                                    }}
                                                                    className="text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400"
                                                                    title="Edit address"
                                                                >
                                                                    <FiEdit className="w-4 h-4" />
                                                                </button>
                                                                {address.id !== defaultAddressId && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleSetDefaultAddress(address.id)}
                                                                            className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                                                                            title="Set as default"
                                                                        >
                                                                            <FiCheck className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteAddress(address.id)}
                                                                            className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                                                            title="Delete address"
                                                                        >
                                                                            <FiX className="w-4 h-4" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <FiMapPin className="mx-auto w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                                                <p className="text-gray-500 dark:text-gray-400">No addresses saved yet</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                                            <input
                                                type="text"
                                                value={editingAddress.street}
                                                onChange={(e) => setEditingAddress({
                                                    ...editingAddress,
                                                    street: e.target.value
                                                })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                placeholder="123 Main St"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apartment, Suite, etc. (Optional)</label>
                                            <input
                                                type="text"
                                                value={editingAddress.street2}
                                                onChange={(e) => setEditingAddress({
                                                    ...editingAddress,
                                                    street2: e.target.value
                                                })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                placeholder="Apt 4B"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    value={editingAddress.city}
                                                    onChange={(e) => setEditingAddress({
                                                        ...editingAddress,
                                                        city: e.target.value
                                                    })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                    placeholder="City"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State/Province</label>
                                                <input
                                                    type="text"
                                                    value={editingAddress.state}
                                                    onChange={(e) => setEditingAddress({
                                                        ...editingAddress,
                                                        state: e.target.value
                                                    })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                    placeholder="State"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP/Postal Code</label>
                                                <input
                                                    type="text"
                                                    value={editingAddress.zip}
                                                    onChange={(e) => setEditingAddress({
                                                        ...editingAddress,
                                                        zip: e.target.value
                                                    })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                    placeholder="12345"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                                                <select
                                                    value={editingAddress.countryCode}
                                                    onChange={(e) => setEditingAddress({
                                                        ...editingAddress,
                                                        countryCode: e.target.value,
                                                        country: e.target.options[e.target.selectedIndex].text
                                                    })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                    required
                                                >
                                                    <option value="US">United States</option>
                                                    <option value="CA">Canada</option>
                                                    <option value="DE">Germany</option>
                                                    <option value="UK">United Kingdom</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-2 pt-2">
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditingAddress(null);
                                                }}
                                                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400"
                                            >
                                                <FiX className="w-4 h-4" />
                                                <span>Cancel</span>
                                            </button>
                                            <button
                                                onClick={() => handleSaveAddress(editingAddress)}
                                                disabled={isUpdatingAddress}
                                                className="flex items-center space-x-1 bg-pink-500 dark:bg-pink-600 text-white px-3 py-1 rounded-lg disabled:opacity-50"
                                            >
                                                <FiSave className="w-4 h-4" />
                                                <span>{isUpdatingAddress ? 'Saving...' : 'Save'}</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                        {activeTab === 'account' && (
                            <motion.div variants={slideUp} className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Account Settings</h2>

                                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Change Password</h3>
                                        <button
                                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                                            className="text-pink-500 dark:text-pink-400 flex items-center space-x-1"
                                        >
                                            {isChangingPassword ? <FiX className="w-4 h-4" /> : <FiEdit className="w-4 h-4" />}
                                            <span>{isChangingPassword ? 'Cancel' : 'Change'}</span>
                                        </button>
                                    </div>

                                    {passwordError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg mb-4"
                                        >
                                            {passwordError}
                                        </motion.div>
                                    )}

                                    {passwordSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg mb-4"
                                        >
                                            {passwordSuccess}
                                        </motion.div>
                                    )}

                                    {isChangingPassword && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="space-y-4"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) => setPasswordForm({
                                                        ...passwordForm,
                                                        currentPassword: e.target.value
                                                    })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                    placeholder="Enter current password"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm({
                                                        ...passwordForm,
                                                        newPassword: e.target.value
                                                    })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                    placeholder="Enter new password"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm({
                                                        ...passwordForm,
                                                        confirmPassword: e.target.value
                                                    })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:focus:ring-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>

                                            <div className="pt-2">
                                                <button
                                                    onClick={handleChangePassword}
                                                    className="w-full bg-pink-500 dark:bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-600 dark:hover:bg-pink-700 transition-colors"
                                                >
                                                    Update Password
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {!isChangingPassword && (
                                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                                            <FiLock className="w-4 h-4" />
                                            <span>Last changed: {formatDate(new Date().toISOString())}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;