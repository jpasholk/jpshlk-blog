const {fontFamily} = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            lineHeight: {
                11: '2.75rem',
                12: '3rem',
                13: '3.25rem',
                14: '3.5rem',
            },
            fontFamily: {
                // sans: ['Space Grotesk', ...fontFamily.sans],
                sans: ['Inter var', ...fontFamily.sans],
            },
            colors: {
                primary: colors.sky,
                gray: colors.gray,
                white: colors.blue,
            },
            typography: ({theme}) => ({
                DEFAULT: {
                    css: {
                        a: {
                            color: theme('colors.blue.600'),
                            '&:hover': {
                                color: `${theme('colors.primary.200')}`,
                            },
                            code: {color: theme('colors.primary.400')},
                        },
                        'h1,h2': {
                            fontWeight: '700',
                            letterSpacing: theme('letterSpacing.tight'),
                        },
                        h3: {
                            fontWeight: '600',
                        },
                        code: {
                            color: theme('colors.rose.500'),
                        },
                    },
                },
                invert: {
                    css: {
                        a: {
                            color: theme('colors.primary.400'),
                            '&:hover': {
                                color: `${theme('colors.primary.300')}`,
                            },
                            code: {color: theme('colors.primary.400')},
                        },
                        'h1,h2,h3,h4,h5,h6': {
                            color: theme('colors.gray.100'),
                        },
                        code: {
                            color: theme('colors.rose.400'),
                        },
                    },
                },
            }),
        },
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
