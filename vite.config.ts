import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PORT is set by the preview tool when it assigns a free port; default to 5173 otherwise.
const port = Number(process.env.PORT) || 5173

export default defineConfig({
  plugins: [react()],
  server: { port },
})
