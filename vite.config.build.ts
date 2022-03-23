import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {name, version} from './package.json'
import dts from 'vite-dts'

const banner = `/*!
* ${name} v${version} ${new Date()}
* (c) 2021 @joeycz
* Released under the MIT License.
*/`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'vue-numeric-input-next',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
				banner,
        globals: {
          vue: 'Vue'
        },
        exports: 'named' /** Disable warning for default imports */
      }
    },
    brotliSize: false,
		emptyOutDir: false,
    terserOptions: {
      compress: {
        pure_funcs: ['console.log'],
        drop_debugger: true
      }
    }
  },
})

