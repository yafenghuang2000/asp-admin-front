import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import fs from 'fs';
import legacy from '@vitejs/plugin-legacy';
import stylelint from 'vite-plugin-stylelint';
import { viteMockServe } from 'vite-plugin-mock';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react({
        tsDecorators: true,
        plugins: [['@swc/plugin-styled-components', {}]],
        devTarget: 'es2022',
      }),
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
      viteCompression({
        algorithm: 'gzip', // 使用 gzip 压缩
        ext: '.gz', // 生成的文件扩展名
        threshold: 1024 * 300, // 对大于 10KB 的文件进行压缩
        deleteOriginFile: false, // 是否删除原始文件
      }),
    ],
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
      chunkSizeWarningLimit: 500,
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
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // 确保路径中没有空字节和查询参数
              const cleanId = id.replace(/\0/g, '').split('?')[0];
              // 获取文件大小（以字节为单位）
              const fileSize = fs.statSync(cleanId).size;
              const ONE_MB = 500 * 1024; // 500KB

              // 将 react 和 react-dom 分开打包
              if (cleanId.includes('react')) {
                return fileSize > ONE_MB ? 'react-large' : 'react';
              }
              if (cleanId.includes('react-dom')) {
                return fileSize > ONE_MB ? 'react-dom-large' : 'react-dom';
              }

              // 处理 antd 相关包
              if (cleanId.includes('@ant-design') || cleanId.includes('antd')) {
                return fileSize > ONE_MB ? 'antd-vendor-large' : 'antd-vendor';
              }

              // 处理其他包
              if (fileSize > ONE_MB) {
                const pkgName = cleanId
                  .toString()
                  .split('node_modules/')[1]
                  .split('/')[0]
                  .toString();
                return `vendor-large-${pkgName.replace('@', '').replace('/', '_')}`;
              }
              return null;
            }

            return null;
          },
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return assetInfo.name.includes('node_modules')
                ? 'css/vendor.[hash].css'
                : 'css/app.[hash].css';
            }
            return '[name].[hash].[ext]'; // 其他文件保持原路径
          },
        },
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
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
      // postcss: {
      //   plugins: [
      //     postcssSplit({
      //       output: {
      //         vendor: 'assets/vendor.css',
      //         app: 'assets/app.css',
      //       },
      //     }),
      //   ],
      // },
    },
  };
});
