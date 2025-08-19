import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'voltage-blue': '#52B2FF',
        'juicy-orange': '#FF6A00',
        'electric-violet': '#5D00FF',
        'bubblegum-pink': '#FF8AD8',
        'off-white': '#F8F5F2',
        'deep-space': '#1A1A1A',
      },
      fontFamily: {
        recoleta: ['var(--font-recoleta)', 'serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
