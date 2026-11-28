/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--primary-color)',
        'doc-navy': '#0b1622',
        'doc-cream': '#efe8dc',
        'doc-sky': '#74acdf',
      },
      fontFamily: {
        'doc-display': ['var(--font-doc-display)', 'sans-serif'],
        'doc-body': ['var(--font-doc-body)', 'sans-serif'],
        'doc-serif': ['var(--font-doc-serif)', 'serif'],
      },
    },
  },
  plugins: [],
};
