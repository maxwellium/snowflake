module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.css',
    'index.html',
    'js/index.js',
    'images/*.png'
  ],
  swSrc: 'src/sw.js',
  swDest: 'build/sw.js',
  globIgnores: [
    '../workbox-config.js'
  ]
};