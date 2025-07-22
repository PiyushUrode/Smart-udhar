/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bluecol: '#2563EB', // your custom blue


      },


      boxShadow: {
        customCard: '0px 10px 15px 0px #0000001A, 0px 4px 6px 0px #0000001A',
      },

      fontFamily: {
        robotoM: ['Roboto-Medium', 'sans-serif'],
        robotoR: ['Roboto-Regular', 'sans-serif'],
        robotoB: ['Roboto-Bold', 'sans-serif'],
        robotoT: ['Roboto-Thin', 'sans-serif'],
        robotoSb: ['Roboto-SemiBold', 'sans-serif'],

        interM: ['Inter-Medium', 'sans-serif'],
        interR: ['Inter-Regular', 'sans-serif'],
        interB: ['Inter-Bold', 'sans-serif'],
        interL: ['Inter-Light', 'sans-serif'],
        interSb: ['Inter-SemiBold', 'sans-serif'],

                InriaR: ['InriaSans-Regular', 'sans-serif'],
      },
      screens: {
        am: '400px',
        sm: '550px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      }
    }
  },
  plugins: [],
}
