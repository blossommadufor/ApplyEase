/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#E8792E',
                    hover: '#C96A28',
                },
                surface: {
                    dark: '#1E2432',
                    DEFAULT: '#FFFFFF',
                },
                customBg: '#F5E6D8',
                text: {
                    primary: '#1F2430',
                    secondary: '#8B93A1',
                },
                customBorder: '#DCE1E7',
                success: {
                    text: '#16A34A',
                    bg: '#DCFCE3',
                },
                warning: {
                    text: '#B45309',
                    bg: '#FEF3C7',
                },
                danger: {
                    text: '#DC2626',
                    bg: '#FEE2E2',
                },
            },
        },
    },
    plugins: [],
}