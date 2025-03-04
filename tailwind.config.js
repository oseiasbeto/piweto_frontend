/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.vue"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#32ba78",
          secondary: "#ffcd36",
          success: "#3bbf63",
          info: "#0096ff",
          danger: "#f33e5c",
        },
      },
      boxShadow: {
        'custom': '0 1px 15px 1px rgba(81,77,92,.5)',
        'custom-secondary': '0 1px 15px 1px rgba(81, 77, 92, .16);',
        'custom-google': '0px 2px 8px 0px rgba(60, 64, 67, 0.25)'
      },
      fontFamily: {
        primary: ['Poppins', 'sans-serif'], // Fonte principal
        secondary: ['Raleway', 'serif'],     // Fonte secundária
      },
      screens: {
        'zoom-110': { max: '1745px' }, // Tamanho aproximado para 110% no zoom
      },
    },
  }
}

