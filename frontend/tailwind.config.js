import daisyui from "daisyui";
import withMT from "@material-tailwind/react/utils/withMT"

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        // Add other font styles if needed
      },
       // Add custom gradient
       backgroundImage: {
        'orange-gradient': 'linear-gradient(135deg, #FF6F00, #ff9400)', // Darker orange to lighter orange
        'orange-gradient-hover': 'linear-gradient(135deg, #ff9400, #FF6F00)', // Hover state

      },
    },
	},
	plugins: [daisyui,withMT],

	daisyui: {
    themes: [
      {
        mytheme: {
    
        },
      },
    ],
  },
};