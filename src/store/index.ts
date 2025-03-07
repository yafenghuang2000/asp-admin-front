import { configureStore } from '@reduxjs/toolkit';
import { createTransform, PersistConfig, persistReducer, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { thunk } from 'redux-thunk';
import { rootReducer, whitelist } from '@/models';
import { IStoreProps } from '@/models/type';

// 创建存储引擎
const createNoopStorage = () => {
  return {
    getItem(): Promise<string | null> {
      return Promise.resolve(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem(_key: string, value: any): Promise<any> {
      return Promise.resolve(value);
    },
    removeItem(): Promise<void> {
      return Promise.resolve();
    },
  };
};

/**
 * 根据当前环境选择使用 sessionStorage 还是无操作存储。
 * 如果在浏览器环境中，则使用 sessionStorage；否则使用无操作存储。
 */
const webStorage =
  typeof window !== 'undefined' ? createWebStorage('session') : createNoopStorage();

/**
 * 创建一个自定义转换器，用于序列化和反序列化状态。
 * 这里简单地返回输入的状态，可以根据需要进行更复杂的转换。
 */
const transform = createTransform<Partial<IStoreProps>, Partial<IStoreProps>, Partial<IStoreProps>>(
  (inboundState) => inboundState, // 序列化
  (outboundState) => outboundState, // 反序列化
);

// 配置持久化
const persistConfig: PersistConfig<Partial<IStoreProps>> = {
  key: 'asp-admin-xms',
  storage: webStorage,
  transforms: [transform], // 使用转换
  whitelist,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const persistedReducer = persistReducer(persistConfig as any, rootReducer);

/**
 * 配置 Redux store，包括：
 * - `reducer`: 经过持久化处理的根 reducer
 * - `middleware`: 默认中间件加上 `thunk` 中间件
 *   - `serializableCheck`: 忽略某些特定的 action 类型，防止序列化检查报错
 */
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ], // 忽略 `redux-persist` 内部使用的 action 类型
      },
    }).concat(thunk),
});

// 创建持久化存储
const persist = persistStore(store);

export { store, persist };
