import typescript from 'rollup-plugin-typescript';

export default [ {
  input: './src/js/index.ts',
  plugins: [
    typescript()
  ],
  output: {
    file: './src/js/index.js',
    format: 'iife'
  }
}, {
  input: './test/test.ts',
  plugins: [
    typescript()
  ],
  output: {
    file: './test/test.js',
    format: 'iife'
  }
} ];