import { flake } from './flake';
import { generatePasswordFromInput } from './crypto';
import { Data, saveToLocalStorage, loadFromLocalStorage } from './persistence';
import { scrollToPosition, setupBandSpans } from './band';

const lowerCaseInput = <HTMLInputElement> document.getElementById( 'lowerCase' ),
  upperCaseInput = <HTMLInputElement> document.getElementById( 'upperCase' ),
  numbersInput = <HTMLInputElement> document.getElementById( 'numbers' ),
  symbolsInput = <HTMLInputElement> document.getElementById( 'symbols' ),
  extendedSymbolsInput = <HTMLInputElement> document.getElementById( 'extendedSymbols' ),
  similarCharsInput = <HTMLInputElement> document.getElementById( 'similarChars' ),
  bandContainer = <HTMLDivElement> document.getElementById( 'band' ),
  lengthsBand = <HTMLDivElement> document.getElementById( 'lengths' ),
  passwordOutput = <HTMLInputElement> document.getElementById( 'password' ),
  copyButton = <HTMLSpanElement> document.getElementById( 'copy' ),
  snowflake = <CanvasRenderingContext2D>( <HTMLCanvasElement> document.getElementById( 'snowflake' ) ).getContext( '2d' );

let lengthInput = 12,
  lengthMin = 4,
  lengthMax = 32;

const spans = setupBandSpans( lengthsBand, [ ...Array( lengthMax + 1 ).keys() ].slice( lengthMin ) );


function copyToClipboard() {
  passwordOutput.select();
  document.execCommand( 'copy' );
}

function getData(): Data {
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
  const password = generatePasswordFromInput( getData() );
  passwordOutput.value = password;
  flake( snowflake );
  save();
}

function save() {
  saveToLocalStorage( getData() );
}

function load() {

  const data = loadFromLocalStorage();
  if ( !data ) { return; }

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
].forEach( input => input.addEventListener( 'change', generate, false ) );


spans.forEach( span => {
  span.addEventListener( 'click', e => {
    lengthInput = parseInt( span.innerText );
    scrollToPosition( bandContainer, lengthsBand, lengthInput );
    generate();
  }, false );
  span.addEventListener( 'keydown', e => {
    if ( e.key !== 'Enter' ) { return; }
    lengthInput = parseInt( span.innerText );
    scrollToPosition( bandContainer, lengthsBand, lengthInput );
    generate();
  }, false );
} );


copyButton.addEventListener( 'click', copyToClipboard, false );


window.addEventListener( 'resize', () => scrollToPosition( bandContainer, lengthsBand, lengthInput ), false );


load();
scrollToPosition( bandContainer, lengthsBand, lengthInput );
generate();