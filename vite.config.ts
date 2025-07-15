import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'antd-base': ['antd/es/skeleton', 'antd/es/space', 'antd/es/skeleton/style', 'antd/es/space/style'],
          'antd-vendor': ['antd'],
          'monaco-vendor': ['monaco-editor', '@monaco-editor/react'],
          'dnd-vendor': ['react-dnd', 'react-dnd-html5-backend']
        }
      }
    },
    // 减小chunk大小
    chunkSizeWarningLimit: 800,
    // 优化资源加载
    assetsInlineLimit: 4096, // 4KB以下的资源内联为base64
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 启用gzip压缩
    reportCompressedSize: false,
  },
  optimizeDeps: {
    // 预构建这些依赖
    include: [
      'react', 
      'react-dom', 
      'antd/es/skeleton',
      'antd/es/space',
      'antd', 
      'monaco-editor', 
      '@monaco-editor/react', 
      'react-dnd', 
      'react-dnd-html5-backend'
    ],
  },
  // 启用esbuild的优化
  esbuild: {
    // 在开发模式下也启用最小化
    minifyIdentifiers: true,
    minifySyntax: true,
  },
  server: {
    // 预热常用模块
    warmup: {
      clientFiles: [
        './src/main.tsx', 
        './src/App.tsx',
        './src/editor/index.tsx',
      ],
    },
  }
});
