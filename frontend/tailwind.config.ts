import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes:{
        loading:{
            '0%,100%':{opacity: '1'},
            '50%':{opacity: '0'},
        }, 
      },
      animation: {
        loading: 'loading 2s linear infinite',
      },
      
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
        'box':'rgb(248, 252, 255,0.45)',
        'bgblue':'#CAE6FF',
        'lightgreen': 'rgb(112, 255, 169,0.25)',
        'green':'#00E55C'

      },
      borderRadius: {
        '2xl': '16px', // Aquí defines tu tamaño personalizado
      },
      scale: {
        '80': '0.8', // Esto añade `scale-200` para escalar elementos al 200%
      },
      boxShadow:{
        shadow: ' 2px 6px 20px -10px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
export default config
