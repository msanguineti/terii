import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/terii.ts',
  output: [
    {
      file: 'dist/terii.umd.js',
      format: 'umd',
      name: 'terii',
    },
    {
      file: 'dist/terii.js',
      format: 'es',
    },
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    terser(),
  ],
}
