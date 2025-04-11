'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiCalendar, FiClock, FiUser, FiMail,FiX } from 'react-icons/fi';
import {useAuth} from "@/context/authcontext";
import {useRouter} from "next/navigation";

export default function AppointmentForm({ product, onCreateInvitation,onClose,date,timeSlot}) {
    const {user} = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: date,
        timeSlot: timeSlot
    });
    const [step, setStep] = useState(1); // 1: Personal info, 2: Date selection, 3: Time selection

    // Available dates - would come from your backend in real implementation
    const availableDates = [
        { id: '1', date: 'Thu. 15', day: 'Thursday', fullDate: '2023-06-15' },
        { id: '2', date: 'Fri. 16', day: 'Friday', fullDate: '2023-06-16' },
        { id: '3', date: 'Sat. 17', day: 'Saturday', fullDate: '2023-06-17' },
    ];

    // Generate time slots
    const generateTimeSlots = () => {
        const slots = [];
        const startHour = 9; // 9 AM
        const endHour = 17; // 5 PM

        for (let hour = startHour; hour < endHour; hour++) {
            slots.push(`${hour}:00 - ${hour}:30`);
            slots.push(`${hour}:30 - ${hour + 1}:00`);
        }

        return slots;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = onCreateInvitation();
        console.log(message)
        localStorage.setItem(formData.email, JSON.stringify(message));
        //router.push(`/checkout?cid=${product.selectedVariant.node.id.split('/').pop()}`)
        await fetch("/api/triggerEmail",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userEmail:formData.email, message:message}),
        }).then(()=>{
            onClose();
        }).catch(()=>{
            console.log("Issue sending mail")
        })
    };

    return (
        <div className="width-100 flex justify-center items-center">
            <div className="flex flex-col fixed top-20 z-999 backdrop-blur-[30px] p-15 rounded-4xl">
                <div className="flex justify-end p-5" onClick={()=>onClose()}>
                    <FiX size={20}/>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Personal Information */}
                    {
                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            className="space-y-4"
                        >
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <FiUser className="text-pink-500"/>
                                <span>Your Information</span>
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="text-gray-400"/>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        className="w-full pl-10 pr-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="text-gray-400"/>
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                        className="w-full pl-10 pr-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                        </motion.div>
                    }
                    {
                        <motion.div>
                            <div className="pt-4 flex gap-3">
                                <motion.button
                                    type="submit"
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-pink-500/30 transition-all"
                                    disabled={!formData.timeSlot}
                                >
                                    Create Invitation
                                </motion.button>
                            </div>
                        </motion.div>
                    }
                </form>
            </div>
        </div>

    );
}