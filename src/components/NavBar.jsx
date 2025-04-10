'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiShoppingBag, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import {ThemeContext} from "@/context/themeContext";
import {useContext} from "react";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import UserDropdown from "@/components/UserProfileDropdown";

const links = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                        ROBO RELAX
                    </Link>

                    <nav className="hidden md:flex gap-8">
                        {links.map((link) => (
                            <motion.div key={link.name} whileHover={{ scale: 1.05 }}>
                                <Link
                                    href={link.href}
                                    className={`${
                                        pathname === link.href
                                            ? 'text-pink-500 dark:text-pink-400'
                                            : 'text-gray-700 dark:text-gray-300'
                                    } font-medium hover:text-pink-500 dark:hover:text-pink-400 transition-colors`}
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <ThemeToggle/>
                       <UserDropdown>

                       </UserDropdown>

                        <Link href="/cart" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 relative">
                            <FiShoppingBag />
                            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
                        </Link>

                        <LocaleSwitcher/>
                    </div>
                </div>
            </div>
        </header>
    );
}