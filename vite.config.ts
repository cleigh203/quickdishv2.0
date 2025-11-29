import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    exclude: [],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and core dependencies
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          
          // UI libraries
          if (id.includes('@radix-ui') || id.includes('lucide-react') || id.includes('cmdk')) {
            return 'ui-vendor';
          }
          
          // Capacitor plugins
          if (id.includes('@capacitor') || id.includes('@capgo')) {
            return 'capacitor-vendor';
          }
          
          // Supabase
          if (id.includes('@supabase')) {
            return 'supabase-vendor';
          }
          
          // Large libraries
          if (id.includes('html2canvas')) {
            return 'html2canvas-vendor';
          }
          
          if (id.includes('jspdf')) {
            return 'jspdf-vendor';
          }
          
          // Chart library
          if (id.includes('recharts')) {
            return 'recharts-vendor';
          }
          
          // Form libraries
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'form-vendor';
          }
          
          // Date utilities
          if (id.includes('date-fns')) {
            return 'date-vendor';
          }
          
          // TanStack Query
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }
        }
      }
    }
  },
  server: {
    host: true, // Allow access from network
    port: 8080,
  },
}));
