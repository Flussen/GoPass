import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'blue': '#00A3FF',
        'red': '#d50000',
        'back': '#DEEFFF',
        'bkblue':'#00172E',
        'grey':'#90A8B9',
        'lightgrey':'#D9E0E7',
        'box':'rgb(248, 252, 255,0.45)'
      },
      borderRadius: {
        '2xl': '16px', // Aquí defines tu tamaño personalizado
      },
      scale: {
        '80': '0.8', // Esto añade `scale-200` para escalar elementos al 200%
      },
      boxShadow:{
        'shadow':'rgb(0, 0, 0, 0.25) 2px 6px 10px -10px;'
      }
    },
  },
  plugins: [],
}
export default config
