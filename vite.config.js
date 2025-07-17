import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // 📊 Bundle visualizer (optional - use only in production preview)
    visualizer({
      open: true,
      filename: 'bundle-report.html',
      template: 'sunburst', // 'treemap', 'circle', 'sunburst'
    }),

    // 🖼️ Image optimization plugin
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 70,
      },
      pngquant: {
        quality: [0.65, 0.8],
        speed: 4,
      },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
      webp: {
        quality: 75,
      },
    }),
  ],

  server: {
    host: true, // Enables access from local network (e.g., mobile)
    port: 5173, // You can change this if needed
  },

  build: {
    outDir: 'dist', // default
    sourcemap: false, // Set to true only when debugging
    minify: 'esbuild', // Use esbuild for fast builds
    chunkSizeWarningLimit: 1000, // Warn if chunks exceed 1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Separate vendor libraries for better caching
        },
      },
    },
  },

  css: {
    devSourcemap: false, // Improves build time
  },

  optimizeDeps: {
    include: ['react', 'react-dom'], // Pre-bundle these for faster startup
  },
});
