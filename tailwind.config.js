/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "application-green": "#30B066",
        "application-nightgreen": "#006532",
        "application-heavywhite": "#E0DFD7",
        "application-gray": "#262626",
        "application-rose": "#FF354E",
        "bkg-grey": "#F8F9FA",
      },
      scrollbarWidth: {
        none: "none",
      },
      backdropBrightness: {
        25: ".25",
      },
    },
  },
  plugins: [],
}

