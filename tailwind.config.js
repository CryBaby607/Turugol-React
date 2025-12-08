// tailwind.config.js
import { TAILWIND_CONFIG } from "./src/constants/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // Extiende con los colores de tu configuración
                primary: TAILWIND_CONFIG.colors.primary,
                gray: TAILWIND_CONFIG.colors.gray,
                success: { DEFAULT: TAILWIND_CONFIG.colors.status.success },
                warning: { DEFAULT: TAILWIND_CONFIG.colors.status.warning },
                error: { DEFAULT: TAILWIND_CONFIG.colors.status.error },
                info: { DEFAULT: TAILWIND_CONFIG.colors.status.info },
            },
        },
    },
    plugins: [],
};
