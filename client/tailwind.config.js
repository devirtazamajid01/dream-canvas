/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'
import daisyui from 'daisyui'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            screens: {
                xs: '475px',
                ...defaultTheme.screens,
            },
            colors: {
                neutral: colors.slate,
                brand: {
                    primary: '#0ea5e9', // sky-500
                    secondary: '#06b6d4', // cyan-500
                    accent: '#4f46e5', // indigo-600
                    gradientFrom: '#06b6d4',
                    gradientVia: '#22d3ee',
                    gradientTo: '#4f46e5',
                },
            },
            fontFamily: {
                lato: ['Lato', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
            },
            animation: {
                text: 'text 10s ease infinite',
                floaty: 'floaty 6s ease-in-out infinite',
            },
            keyframes: {
                text: {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center',
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center',
                    },
                },
                floaty: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [daisyui],
    daisyui: {
        darkTheme: 'light',
    },
}
