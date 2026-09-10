import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite needs to know we're building a React app so it can transform
// JSX (the HTML-like syntax inside .jsx files) into plain JavaScript.
export default defineConfig({
  plugins: [react()],
})
