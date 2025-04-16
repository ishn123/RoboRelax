'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiShoppingCart, FiPlus, FiMinus,FiX } from 'react-icons/fi';
import Image from 'next/image';
import {useParams} from "next/navigation";
import {shopifyClient} from "@/lib/shopify";
import {gql} from "@apollo/client";
import AppointmentForm from "@/components/AppointmentForm";
import {useCart} from "@/context/cartcontext";

export default function ProductPage() {
    const [product, setProduct] = useState(null);
    const params = useParams();
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [isFeatured, setIsFeatured] = useState(false);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const {addToCart} = useCart();

    const getNextDates = (count = 4)=>{
        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
        const fullDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
        const res = [],d = new Date();

        while(res.length < count){
            d.setDate(d.getDate() + 1);
            if(d.getDay() === 0)continue;
            res.push({
                date:`${days[d.getDay()]}. ${d.getDate()}`,
                day:fullDays[d.getDay()],
                fullDate:d.toISOString().split("T")[0]
            });
        }

        return res;

    }

    const onCreateInvitation = ()=>{

        const p1 = "Hey your booking for the product" + product.title;
        const p2 = product.selectedVariant?product.selectedVariant.node.title:""
        const p3 = "has been scheduled for the date " + selectedDate.fullDate + " at the time" + selectedTimeSlot

        return p1 + " " + p2 + " " +  p3;
    }

    const changeVariant = (variant) => {
        setSelectedVariant(variant);
        setProduct()

    }

    // Mock product data - replace with your actual data fetching
    useEffect(() => {
        const fetchProduct = async () => {
            // Simulate API call
            const query = gql`
                    query GetProduct($id: ID!) {
                      product(id: $id) {
                        id
                        title
                        description
                          featuredImage {
                              url
                          }
                          tags
                          variants(first:2){
                              
                              edges{
                                  node{
                                      id
                                      title
                                      price{
                                          amount
                                      }
                                      
                                  }
                              }
                          }
                      }
                    }
            `;

            const variables = {
                id: "gid://shopify/Product/"+params.handle,
            };

            const { data } = await shopifyClient.query({
                query: query,
                variables: variables
            });

            console.log(data);

            const variants = data.product.variants.edges;



            // API call
            const {id,title,description,featuredImage,tags,price} = data.product;
            setProduct({
                id,
                title,
                description,
                tags,
                price:variants.length > 0? Number(variants[0].node.price.amount) : 30,
                image: featuredImage.url,
                variants:variants,
                selectedVariant:variants.length>1?variants[0]:null,
                availableDates: getNextDates()
            });
            if(Array.from(tags).includes("featured")){
                setIsFeatured(true);
            }
        };

        fetchProduct();
    }, [params.handle]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    // Generate time slots
    const generateTimeSlots = () => {
        if (!selectedDate) return [];

        const slots = [];
        const startHour = 9; // 9 AM
        const endHour = 17; // 5 PM

        for (let hour = startHour; hour < endHour; hour++) {
            slots.push(`${hour}:00 - ${hour}:30`);
            slots.push(`${hour}:30 - ${hour + 1}:00`);
        }

        return slots;
    };

    const handleAddToCart = async (e) => {

        e.preventDefault();


        if(product.selectedVariant){
            const variantId = product.selectedVariant.node.id;
            await addToCart(variantId,quantity);

        }else{
            await addToCart(product.variants[0].node.id,quantity);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>

                        {/* Decorative elements */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-pink-500/10 backdrop-blur-sm border border-pink-500/30 z-10 hidden lg:block"
                        />
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                {product.title}
                            </h1>
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                €{product.price.toFixed(2)}
                            </div>
                        </div>

                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            {product.description}
                        </p>

                        {/* Available Variants*/}
                        {product.variants.length > 1 && (
                            <div className="mb-8">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                    Available Variants:
                                </h4>
                                <div className="flex flex-wrap gap-2.5">
                                    <div className="flex flex-wrap gap-3">
                                        {product.variants.map((variant,index) => (
                                            <motion.button
                                                key={index}
                                                whileHover={{scale: 1.05}}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setProduct({
                                                        ...product,
                                                        selectedVariant:variant,
                                                        price:Number(variant.node.price.amount)
                                                    });
                                                }}
                                                className={`px-4 py-2 rounded-lg ${
                                                    variant.node.id === product.selectedVariant.node.id
                                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-400'
                                                } transition-all`}
                                            >
                                                {variant.node.title}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appointment Booking */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                            {product.tags.includes("featured") && (

                                <>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <FiCalendar className="text-pink-500"/>
                                        <span>Book Your Consultation</span>
                                    </h3>

                                    {/* Available Dates */}
                                    <div className="mb-8">
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                            AVAILABLE DATES
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {product.availableDates.map((date) => (
                                                <motion.button
                                                    key={date.date}
                                                    whileHover={{scale: 1.05}}
                                                    whileTap={{scale: 0.95}}
                                                    onClick={() => {
                                                        setSelectedDate(date);
                                                        setShowCalendar(true);
                                                        setSelectedTimeSlot(null);
                                                    }}
                                                    className={`px-4 py-2 rounded-lg ${
                                                        selectedDate?.date === date.date
                                                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-400'
                                                    } transition-all`}
                                                >
                                                    {date.date}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Calendar Modal */}
                                    <AnimatePresence>
                                        {showCalendar && selectedDate && (
                                            <motion.div
                                                initial={{opacity: 0, y: 20}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: 20}}
                                                transition={{duration: 0.2}}
                                                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8"
                                            >
                                                <div className="flex justify-between items-center mb-6">
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {selectedDate.day}, {selectedDate.date}
                                                    </h4>
                                                    <button
                                                        onClick={() => setShowCalendar(false)}
                                                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        <FiX className="text-gray-500 dark:text-gray-400"/>
                                                    </button>
                                                </div>

                                                <div className="space-y-4">
                                                    <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                        <FiClock className="text-pink-500"/>
                                                        AVAILABLE TIME SLOTS
                                                    </h5>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {generateTimeSlots().map((slot) => (
                                                            <motion.button
                                                                key={slot}
                                                                whileHover={{scale: 1.03}}
                                                                whileTap={{scale: 0.97}}
                                                                onClick={() => setSelectedTimeSlot(slot)}
                                                                className={`p-3 rounded-lg text-center ${
                                                                    selectedTimeSlot === slot
                                                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                                                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                                } transition-colors`}
                                                            >
                                                                {slot}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>

                            )}


                            {/* Quantity Selector */}
                            <div className="mb-8">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                    QUANTITY
                                </h4>
                                <div className="flex items-center gap-4">
                                    <motion.button
                                        whileHover={{scale: 1.1}}
                                        whileTap={{scale: 0.9}}
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <FiMinus className="text-gray-700 dark:text-gray-300"/>
                                    </motion.button>
                                    <span className="text-xl font-medium w-8 text-center">
                    {quantity}
                  </span>
                                    <motion.button
                                        whileHover={{scale: 1.1}}
                                        whileTap={{scale: 0.9}}
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <FiPlus className="text-gray-700 dark:text-gray-300"/>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Price per unit</span>
                                    <span className="font-medium">€{product.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Quantity</span>
                                    <span className="font-medium">{quantity}</span>
                                </div>
                                {selectedDate && selectedTimeSlot && (
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">Appointment</span>
                                        <span className="font-medium text-sm">
                      {selectedDate.date} at {selectedTimeSlot}
                    </span>
                                    </div>
                                )}
                                <div
                                    className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total</span>
                                    <span
                                        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                    €{(product.price * quantity).toFixed(2)}
                  </span>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            {
                                isFeatured ? (
                                        <motion.button
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            onClick={() => setAppointmentModalOpen(true)}
                                            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-3"
                                        >
                                            <span>Book Appointment</span>
                                        </motion.button>
                                    ) :

                                    (

                                        <motion.button
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            onClick={handleAddToCart}
                                            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-3"
                                        >
                                            <FiShoppingCart className="text-xl"/>
                                            <span>Add to Cart</span>
                                        </motion.button>

                                    )
                            }

                        </div>
                    </motion.div>
                </div>
            </div>
                {appointmentModalOpen && <AppointmentForm onClose={setAppointmentModalOpen} product={product} onCreateInvitation={onCreateInvitation} date={selectedDate} timeSlot={selectedTimeSlot} handleAddToCart={handleAddToCart}/>}


        </div>
    );
}