/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.vue"],
  theme: {
    extend: {
      colors: {
        "black-text": "#272c2f",
        "primary": "#632291",
        "secondary": "#ffd300",
        "success": "#3bbf63",
        "info": "#0096ff",
        "danger": "#f33e5c",
        "border-color": "rgb(221,224,228)",
        "btn-pay-color": "#09d13c",
        "muted-bg": "rgba(0,0,0,.12)",
        "muted-color": "rgba(0,0,0,.26)"
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'], // Fonte principal
        secondary: ['Raleway', 'serif'],     // Fonte secundária
      }
    },
  }
}

