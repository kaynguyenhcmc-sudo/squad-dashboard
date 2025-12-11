import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
      },
      colors: {
        nav: {
          back: {
            rest: "#1f1d23",
            selected: "#fec62e",
          },
          fore: {
            rest: "#f2f1f3",
            selected: "#000000",
          },
        },
        elevation: {
          base: "#141217",
          raised: "#1c1a21",
          surface: "#242229",
        },
        text: {
          strong: "#f2efed",
          weak: "rgba(242, 239, 237, 0.7)",
          key: "#6bc1ff",
          muted: "rgba(242, 239, 237, 0.5)",
        },
        stroke: {
          weak: "rgba(242, 239, 237, 0.25)",
          strong: "rgba(242, 239, 237, 0.6)",
          selected: "#6bc1ff",
          key: "#fec62e",
        },
        fill: {
          key: "#fec62e",
          progress: "#6bc1ff",
          info: "#165a8a",
        },
      },
    },
  },
  plugins: [],
};
export default config;

