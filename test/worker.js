(function () {
  'use strict';

  function getRandomArray(length, max) {
      return Array
          .from(self.crypto.getRandomValues(new Uint32Array(length)))
          .map(i => Math.floor(i / (0xffffffff + 1) * max));
  }

  const ctx = self;
  ctx.addEventListener('message', onMessage);
  function onMessage(message) {
      const { pool, iterations, minLength, maxLength } = message.data;
      const distribution = run(pool, iterations, minLength, maxLength);
      ctx.postMessage({
          command: 'done',
          distribution: distribution
      });
  }
  function run(pool, iterations, minLength, maxLength) {
      const distribution = {}, poolArray = pool.split('');
      poolArray.reduce((d, c) => { d[c] = 0; return d; }, distribution);
      for (let i = 0; i < iterations; i++) {
          const length = Math.random() * (maxLength - minLength) + minLength;
          const randoms = getRandomArray(length, pool.length);
          for (let i2 = 0; i2 < randoms.length; i2++) {
              distribution[pool[randoms[i2]]]++;
          }
      }
      return distribution;
  }

}());
