import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import legacy from '@vitejs/plugin-legacy';
import fs from 'fs';
import { viteMockServe } from 'vite-plugin-mock';

const manualChunks = (id: string): string | null => {
  if (id.includes('node_modules')) {
    // 确保路径中没有空字节和查询参数
    const cleanId = id.replace(/\0/g, '').split('?')[0];
    // 获取文件大小（以字节为单位）
    const fileSize = fs.statSync(cleanId).size;
    const ONE_MB = 1024 * (1024 * 2);
    // 优先处理 react 和 antd 相关包
    if (cleanId.includes('react')) {
      return fileSize > ONE_MB ? 'react-vendor-large' : 'react-vendor';
    }
    if (cleanId.includes('@ant-design') || cleanId.includes('antd')) {
      return fileSize > ONE_MB ? 'antd-vendor-large' : 'antd-vendor';
    }
    // 处理其他包
    if (fileSize > ONE_MB) {
      const pkgName = cleanId.toString().split('node_modules/')[1].split('/')[0].toString();
      return `vendor-large-${pkgName.replace('@', '').replace('/', '_')}`;
    }
    return 'vendor';
  }

  return null;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      viteMockServe({
        mockPath: 'mock',
        enable: true, // 设置为true，开启mock功能
        watchFiles: true, // 如果使用 TypeScript，可以设置为 true
        logger: true, // 打印日志
      }),
    ],
    base: '/asp-admin-xms/',
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
          comments: false, // 移除注释
        },
      },
      rollupOptions: {
        input: 'src/main.tsx',
        output: {
          manualChunks(id) {
            return manualChunks(id);
          },
          chunkFileNames: (chunkInfo) => {
            return chunkInfo.name.includes('vendor')
              ? 'js/vendor/[name].[hash].js'
              : 'js/app/[name].[hash].js';
          },
          entryFileNames: 'js/app/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            // 根据 asset 的类型和路径决定输出子目录
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return assetInfo.name.includes('node_modules')
                ? 'css/vendor/[name].[hash].[ext]'
                : 'css/app/[name].[hash].[ext]';
            }
            return 'assets/[name].[hash].[ext]';
          },
        },
      },
    },
  };
});
