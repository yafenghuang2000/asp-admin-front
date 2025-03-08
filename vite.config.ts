import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import legacy from '@vitejs/plugin-legacy';
import stylelint from 'vite-plugin-stylelint';
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      stylelint({
        fix: true,
        include: ['src/**/*.{css,scss}'],
        exclude: ['node_modules'],
      }),
      viteMockServe({
        mockPath: 'mock',
        enable: true, // 设置为true，开启mock功能
        watchFiles: true, // 如果使用 TypeScript，可以设置为 true
        logger: true, // 打印日志
      }),
    ],
    base: '/asp-xms-vite/',
    server: {
      port: 8000,
      open: true,
      host: '0.0.0.0',
      strictPort: false,
      cors: true,
      strict: true,
      proxy: {
        '/api': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#1890ff',
          },
        },
        sass: {}, // 添加对 SCSS 文件的支持
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __APP_BASE_API__: JSON.stringify(env.VITE_APP_BASE_API),
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE),
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      chunkSizeWarningLimit: 1024,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        mangle: true,
        output: {
          comments: true, // 移除注释
        },
      },
      rollupOptions: {
        output: {},
      },
    },
  };
});
