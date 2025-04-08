const config =  {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}', // Add any other paths where you're using Tailwind
    ],
    darkMode: "class",
    variants: {
        extend: {
            backgroundColor: ['dark'],
            textColor: ['dark'],
            borderColor: ['dark'],
            // Add other utilities you need
            boxShadow: ['dark'],
            gradientColors: ['dark']
        }
    },
    theme: {
        extend: {
            fontFamily: {
                sans: ['Lato', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
export default config;
