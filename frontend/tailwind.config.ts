import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundClip: {
        text: 'text',
      },
      keyframes:{
        loading:{
            '0%,100%':{opacity: '1', height: '2.5rem'},
            '33%,66%':{opacity: '0.5', height: '1.75rem'},
            '50%':{opacity: '0', height: '1rem'},
        }, 
      },
      animation: {
        loading: 'loading 0.9s linear infinite',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient':'linear-gradient(140deg, rgba(255,153,0,1) 0%, rgba(59,0,255,1) 100%)',
      },
      colors: {
        
        'back': '#121111',
        'darkgray': '#282727',
        'whitegray':'#979797',
        'gray':'#5A5757',
        'white':'#FFFFFF',
        'green':'#ADFF00',
'darkgreen': '#8BCD00'

      },
      borderRadius: {
        '2xl': '16px', 
      },
      scale: {
        '80': '0.8', 
      },
      boxShadow:{
        shadow: ' 2px 6px 20px -10px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  variants: {
    extend: {
      backgroundClip: ['hover', 'focus'],
    },
  },
  plugins: [],
}
export default config
