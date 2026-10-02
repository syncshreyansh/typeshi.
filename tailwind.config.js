/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2e3830',
        accent: '#2bee4b',
        ink: '#121613',
        muted: '#516254',
        'muted-soft': '#3a463c',
        'surface-dark': '#232924',
        canvas: '#fafffa',
        hairline: '#c8d2c8',
        'on-dark': '#fafffa',
      },
      borderRadius: {
        sm: '5px',
        md: '8px',
        lg: '10px',
        xl: '14px',
      },
      spacing: {
        xxs: '8px',
        xs: '10px',
        sm: '15px',
        md: '20px',
        lg: '30px',
        xl: '40px',
        xxl: '50px',
        huge: '80px',
        section: '120px',
      },
      boxShadow: {
        'green-strong': '1px 8px 20px rgba(16, 94, 29, 0.45)',
        'green-soft': '1px 8px 20px rgba(18, 146, 39, 0.25)',
      },
      fontFamily: {
        sans: ['Google Sans Flex Variable', 'sans-serif'],
        display: ['Google Sans Flex Variable', 'sans-serif'],
        body: ['Google Sans Flex Variable', 'sans-serif'],
        'serif-display': ['Instrument Serif', 'serif'],
        'pixel-display': ['Pixelify Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
