(function () {
  'use strict';

  const POOL = {
      lowerCase: 'abcdefghijklmnopqrstuvwxyz',
      upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!#$%&*+-=?@^_',
      extendedSymbols: '{}[]()\/\'"`~,;:.<>\\|'
  };

  function getRandomArray(length, max) {
      return Array
          .from(window.crypto.getRandomValues(new Uint32Array(length)))
          .map(i => Math.floor(i / (0xffffffff + 1) * max));
  }

  let pool = Object.keys(POOL).map(k => POOL[k]).join(''), minLength = 4, maxLength = 32, iterations = 1000000;
  const table = document.getElementById('table'), runButton = document.getElementById('run'), sortButton = document.getElementById('sort');
  async function run() {
      const distribution = {}, poolArray = pool.split('');
      poolArray.reduce((d, c) => { d[c] = 0; return d; }, distribution);
      for (let i = 0; i < iterations; i++) {
          const length = Math.random() * (maxLength - minLength) + minLength;
          const randoms = await getRandomArray(length, pool.length);
          for (let i2 = 0; i2 < randoms.length; i2++) {
              distribution[pool[randoms[i2]]]++;
          }
      }
      for (let c of poolArray) {
          const row = table.insertRow();
          row.insertCell().innerText = c;
          row.insertCell().innerText = String(distribution[c]);
      }
  }
  function sort() {
      let rows, switching, i, x, y, shouldSwitch;
      switching = true;
      while (switching) {
          switching = false;
          rows = table.rows;
          for (i = 1; i < (rows.length - 1); i++) {
              shouldSwitch = false;
              x = rows[i].getElementsByTagName("TD")[1];
              y = rows[i + 1].getElementsByTagName("TD")[1];
              if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                  shouldSwitch = true;
                  break;
              }
          }
          if (shouldSwitch) {
              rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
              switching = true;
          }
      }
  }
  runButton.addEventListener('click', run, false);
  sortButton.addEventListener('click', sort, false);

}());
