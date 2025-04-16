"use client";
import {useEffect, useState} from "react";
import { motion } from "framer-motion";
import {useAuth} from "@/context/authcontext";

export default function AuthForm() {
    const {user,login,register}  = useAuth();
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        lastName: "",

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(isLogin){
            await login(formData.email,formData.password);
        }else{
            await register(formData.email,formData.password,formData.name,formData.lastName);
        }
    }

    useEffect(()=>{
        if(user){
            // send to checkout
        }
    },[])

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f051d] to-[#350353] p-4">
            <motion.div
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.6}}
                className="bg-[#1e0f38] rounded-3xl shadow-2xl p-10 w-full max-w-md text-white"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-white">
                    {isLogin ? "Welcome Back 💜" : "Create an Account 🌟"}
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="First Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-[#2a174d] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-[#2a174d] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#2a174d] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#2a174d] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg"
                        type="submit"
                    >
                        {isLogin ? "Login" : "Sign Up"}
                    </motion.button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-purple-300 hover:text-purple-400 transition"
                    >
                        {isLogin
                            ? "Don't have an account? Sign Up"
                            : "Already have an account? Login"}
                    </button>
                </div>

                {isLogin && (
                    <div className="text-center mt-4">
                        <button className="text-xs text-purple-400 hover:underline">
                            Forgot Password?
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
