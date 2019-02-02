(function () {
  'use strict';

  const POOL = {
      lowerCase: 'abcdefghijklmnopqrstuvwxyz',
      upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!#$%&*+-=?@^_',
      extendedSymbols: '{}[]()\/\'"`~,;:.<>\\|'
  };

  function statsFromDistribution(distribution) {
      const values = [];
      let sum = 0, count = 0, median = 0;
      for (let c in distribution) {
          sum += distribution[c];
          count++;
      }
      median = sum / count;
      for (let c in distribution) {
          values.push({
              c,
              count: distribution[c],
              fromMedian: distribution[c] - median
          });
      }
      return { sum, count, median, values };
  }
  function sortTable(table, index, numeric = true) {
      let switching = true, shouldSwitch = false, rows, i, x, y;
      while (switching) {
          switching = false;
          rows = table.rows;
          for (i = 1; i < (rows.length - 1); i++) {
              shouldSwitch = false;
              x = rows[i].getElementsByTagName('TD')[index];
              y = rows[i + 1].getElementsByTagName('TD')[index];
              if (numeric) {
                  if (parseFloat(x.innerText) > parseFloat(y.innerText)) {
                      shouldSwitch = true;
                      break;
                  }
              }
              else {
                  if (x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
                      shouldSwitch = true;
                      break;
                  }
              }
          }
          if (shouldSwitch) {
              rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
              switching = true;
          }
      }
  }

  let pool = Object.keys(POOL).map(k => POOL[k]).join(''), minLength = 4, maxLength = 32, iterations = 100000;
  const table = document.getElementById('table'), runButton = document.getElementById('run'), sortChar = document.getElementById('sortChar'), sortCount = document.getElementById('sortCount'), sortDistance = document.getElementById('sortDistance'), countSpan = document.getElementById('count'), sumSpan = document.getElementById('sum'), medianSpan = document.getElementById('median');
  const worker = new Worker('worker.js');
  function run() {
      runButton.disabled = true;
      function handleWorkerCompletion(message) {
          if (message.data.command !== 'done') {
              return;
          }
          worker.removeEventListener('message', handleWorkerCompletion);
          runButton.disabled = false;
          const distribution = message.data.distribution;
          const stats = statsFromDistribution(distribution);
          while (table.rows.length > 1) {
              table.deleteRow(-1);
          }
          for (let value of stats.values) {
              const row = table.insertRow();
              row.insertCell().innerText = value.c;
              row.insertCell().innerText = String(value.count);
              row.insertCell().innerText = value.fromMedian.toFixed(2);
          }
          sumSpan.innerText = String(stats.sum);
          countSpan.innerText = String(stats.count);
          medianSpan.innerText = stats.median.toFixed(2);
      }
      worker.addEventListener('message', handleWorkerCompletion, false);
      worker.postMessage({
          pool,
          iterations,
          minLength,
          maxLength
      });
  }
  runButton.addEventListener('click', run, false);
  sortChar.addEventListener('click', () => sortTable(table, 0, false), false);
  sortCount.addEventListener('click', () => sortTable(table, 1), false);
  sortDistance.addEventListener('click', () => sortTable(table, 2), false);

}());
