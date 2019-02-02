(function () {
  'use strict';

  function flake(snowflake) {
      snowflake.shadowBlur = 1;
      snowflake.shadowColor = snowflake.fillStyle = '#690000';
      snowflake.clearRect(0, 0, 140, 140);
      let j = 0, s = 0, c = 0, a = 0, I = 0, Y = 0, i = 0;
      let C = (X) => { snowflake.fillRect(70 + X, s * j + c * Y + 70, 1, 1); return X; };
      for (Y = 0; Y < 70; Y++) {
          I = Math.random() - 1.9 & I + 1;
          for (i = 12; i--; C(-C((c = Math.cos(a = Math.PI / 3 * i)) * j - (s = Math.sin(a)) * Y))) {
              j = i > 5 ? I : 0;
          }
      }
  }

  const POOL = {
      lowerCase: 'abcdefghijklmnopqrstuvwxyz',
      upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!#$%&*+-=?@^_',
      extendedSymbols: '{}[]()\/\'"`~,;:.<>\\|'
  };
  function getPool(lowerCase, upperCase, numbers, symbols, extendedSymbols, similarChars) {
      let pool = (lowerCase ? POOL.lowerCase : '') +
          (upperCase ? POOL.upperCase : '') +
          (numbers ? POOL.numbers : '') +
          (symbols ? POOL.symbols : '') +
          (extendedSymbols ? POOL.extendedSymbols : '');
      if (!similarChars) {
          pool = pool.replace(/[iloIO01]/g, '');
      }
      return pool;
  }

  function generatePassword(length, pool) {
      return getRandomArray(length, pool.length)
          .map(n => pool[n])
          .join('');
  }
  function getRandomArray(length, max) {
      return Array
          .from(self.crypto.getRandomValues(new Uint32Array(length)))
          .map(i => Math.floor(i / (0xffffffff + 1) * max));
  }
  function generatePasswordFromInput(data) {
      return generatePassword(data.length, getPool(data.lowerCase, data.upperCase, data.numbers, data.symbols, data.extendedSymbols, data.similarChars));
  }

  function saveToLocalStorage(data) {
      try {
          window.localStorage.setItem('snowflake', JSON.stringify(data));
      }
      catch (e) {
          console.log('cant save your settings');
      }
  }
  function loadFromLocalStorage() {
      let dataS = '';
      try {
          dataS = window.localStorage.getItem('snowflake');
      }
      catch (e) {
          console.log('cant load your settings');
      }
      if (!dataS) {
          return null;
      }
      return JSON.parse(dataS);
  }

  function scrollToPosition(container, band, position) {
      const spans = band.querySelectorAll('span'), lengthS = String(position);
      for (let i = 0; i < spans.length; i++) {
          const span = spans[i];
          if (span.innerText !== lengthS) {
              span.classList.remove('selected');
          }
          else {
              span.classList.add('selected');
              const mq = window.matchMedia('(max-height: 600px)');
              if (mq.matches) {
                  band.style.left = '0px';
                  band.style.top = `${container.clientHeight / 2 - span.clientHeight / 2 - span.offsetTop}px`;
              }
              else {
                  band.style.top = '0px';
                  band.style.left = `${container.clientWidth / 2 - span.clientWidth / 2 - span.offsetLeft}px`;
              }
          }
      }
  }
  function setupBandSpans(band, numbers) {
      const spans = [];
      while (band.lastChild) {
          band.removeChild(band.lastChild);
      }
      for (let n of numbers) {
          const span = document.createElement('span');
          span.innerHTML = String(n);
          band.appendChild(span);
          spans.push(span);
      }
      return spans;
  }

  const lowerCaseInput = document.getElementById('lowerCase'), upperCaseInput = document.getElementById('upperCase'), numbersInput = document.getElementById('numbers'), symbolsInput = document.getElementById('symbols'), extendedSymbolsInput = document.getElementById('extendedSymbols'), similarCharsInput = document.getElementById('similarChars'), bandContainer = document.getElementById('band'), lengthsBand = document.getElementById('lengths'), passwordOutput = document.getElementById('password'), copyButton = document.getElementById('copy'), snowflake = document.getElementById('snowflake').getContext('2d');
  let lengthInput = 12, lengthMin = 4, lengthMax = 32;
  const spans = setupBandSpans(lengthsBand, [...Array(lengthMax + 1).keys()].slice(lengthMin));
  function copyToClipboard() {
      passwordOutput.select();
      document.execCommand('copy');
  }
  function getData() {
      return {
          lowerCase: lowerCaseInput.checked,
          upperCase: upperCaseInput.checked,
          numbers: numbersInput.checked,
          symbols: symbolsInput.checked,
          extendedSymbols: extendedSymbolsInput.checked,
          similarChars: similarCharsInput.checked,
          length: lengthInput
      };
  }
  function generate() {
      const password = generatePasswordFromInput(getData());
      passwordOutput.value = password;
      flake(snowflake);
      save();
  }
  function save() {
      saveToLocalStorage(getData());
  }
  function load() {
      const data = loadFromLocalStorage();
      if (!data) {
          return;
      }
      lowerCaseInput.checked = data.lowerCase;
      upperCaseInput.checked = data.upperCase;
      numbersInput.checked = data.numbers;
      symbolsInput.checked = data.symbols;
      extendedSymbolsInput.checked = data.extendedSymbols;
      similarCharsInput.checked = data.similarChars;
      lengthInput = data.length;
  }
  [
      lowerCaseInput,
      upperCaseInput,
      numbersInput,
      symbolsInput,
      extendedSymbolsInput,
      similarCharsInput
  ].forEach(input => input.addEventListener('change', generate, false));
  spans.forEach(span => {
      span.addEventListener('click', e => {
          lengthInput = parseInt(span.innerText);
          scrollToPosition(bandContainer, lengthsBand, lengthInput);
          generate();
      }, false);
      span.addEventListener('keydown', e => {
          if (e.key !== 'Enter') {
              return;
          }
          lengthInput = parseInt(span.innerText);
          scrollToPosition(bandContainer, lengthsBand, lengthInput);
          generate();
      }, false);
  });
  copyButton.addEventListener('click', copyToClipboard, false);
  window.addEventListener('resize', () => scrollToPosition(bandContainer, lengthsBand, lengthInput), false);
  load();
  scrollToPosition(bandContainer, lengthsBand, lengthInput);
  generate();

}());
