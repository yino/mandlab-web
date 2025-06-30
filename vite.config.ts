import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const root = process.cwd();
  const env = loadEnv(mode, root); // 加载当前模式下的 .env 文件
  console.log("env", env); // 打印所有加载的环境变量
  return {
    plugins: [vue()],
    base: env.VITE_PUBLIC_PATH, // 示例：读取 VITE_PUBLIC_PATH
  };
});