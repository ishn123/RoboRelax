'use client';

import { useContext } from 'react';
import { ThemeContext } from "@/context/themeContext";
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {darkMode ? (
                <FiSun className="w-5 h-5 text-yellow-300" />
            ) : (
                <FiMoon className="w-5 h-5 text-gray-700" />
            )}
        </button>
    );
}