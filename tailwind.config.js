function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: withOpacityValue("--color-primary"),
        danger: withOpacityValue("--color-danger"),
        warning: withOpacityValue("--color-warning"),
        info: withOpacityValue("--color-info"),
        success: withOpacityValue("--color-success"),
      },
      fontFamily: {
        "rubik-medium": ["RubikMedium", "Helvetica", "Arial", "sans-serif"],
        "rubik-bold": ["RubikBold", "Helvetica", "Arial", "sans-serif"],
        "rubik-light": ["RubikLight", "Helvetica", "Arial", "sans-serif"],
        "rubik-semibold": [
          "RubikSemiBold",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        "rubik-regular": [
          "RubikRegular",
          "sans-serif",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
