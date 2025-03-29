import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
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
        deleteOriginFile: true, // 是否删除原始文件
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
        [`/${env.VITE_APP_BASE_API}`]: {
          target: `${env.VITE_APP_BASE_URL}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^/${env.VITE_APP_BASE_API}`), ''),
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
            // 检查是否是 node_modules 中的模块
            if (id.includes('node_modules')) {
              return 'vendor'; // 将所有来自 node_modules 的包放入 vendor 分包
            }
            // 根据项目结构进行分包
            if (id.includes('src/utils')) {
              return 'utils'; // 将所有来自 src/utils 的包放入 utils 分包
            }
            if (id.includes('src/components')) {
              return 'components'; // 将所有来自 src/components 的包放入 components 分包
            }

            if (id.includes('src/pages')) {
              return 'pages';
            }
            // 其他模块可以根据需要进行分包
            return null; // 返回 null 以使用默认分包
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
