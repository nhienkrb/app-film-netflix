// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// export default defineConfig({ plugins: [react()] })

// // vite.config.ts
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'node:path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//     // (tuỳ chọn) extensions để import không cần đuôi
//     extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
//   }
// })

// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
})

