import typescript from 'rollup-plugin-typescript';

const MAIN = [ {
  input: './src/js/index.ts',
  plugins: [
    typescript()
  ],
  output: {
    file: './src/js/index.js',
    format: 'iife'
  }
} ];

const TEST = [ {
  input: './test/test.ts',
  plugins: [
    typescript()
  ],
  output: {
    file: './test/test.js',
    format: 'iife'
  }
}, {
  input: './test/worker.ts',
  plugins: [
    typescript()
  ],
  output: {
    file: './test/worker.js',
    format: 'iife'
  }
} ];


export default MAIN.concat( TEST );