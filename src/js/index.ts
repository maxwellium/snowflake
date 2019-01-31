function getPool(
  lowerCase: boolean,
  upperCase: boolean,
  numbers: boolean,
  symbols: boolean,
  extendedSymbols: boolean,
  similarChars: boolean
) {
  let pool =
    ( lowerCase ? 'abcdefghijklmnopqrstuvwxyz' : '' ) +
    ( upperCase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '' ) +
    ( numbers ? '0123456789' : '' ) +
    ( symbols ? '!#$%&*+-=?@^_' : '' ) +
    ( extendedSymbols ? '{}[]()\/\'"`~,;:.<>\\|' : '' );

  if ( !similarChars ) {
    pool = pool.replace( /[iloIO01]/g, '' );
  }

  return pool;
}

function generatePassword( length: number, pool: string ) {
  return getRandomArray( length, pool.length )
    .map( n => pool[ n ] )
    .join( '' );
}

function getRandomArray( length: number, max: number ): number[] {
  return Array
    .from(
      window.crypto.getRandomValues(
        new Uint32Array( length )
      ) )
    .map(
      i => Math.floor(
        i / ( 0xffffffff + 1 ) * ( max + 1 )
      )
    );
}

function copyToClipboard() {
  passwordOutput.select();
  document.execCommand( 'copy' );
}

function flake() {
  snowflake.clearRect( 0, 0, 140, 140 );
  let j = 0, s = 0, c = 0, a = 0, I = 0, Y = 0, i = 0;
  let C = ( X: number ) => { snowflake.fillRect( 70 + X, s * j + c * Y + 70, 1, 1 ); return X };
  for ( Y = 0; Y < 70; Y++ ) {
    I = Math.random() - 1.9 & I + 1;
    for ( i = 12; i--; C( -C( ( c = Math.cos( a = Math.PI / 3 * i ) ) * j - ( s = Math.sin( a ) ) * Y ) ) ) {
      j = i > 5 ? I : 0;
    }
  }
}


function generatePasswordFromInput() {
  const password = generatePassword(
    lengthInput,
    getPool(
      lowerCaseInput.checked,
      upperCaseInput.checked,
      numbersInput.checked,
      symbolsInput.checked,
      extendedSymbolsInput.checked,
      similarCharsInput.checked,
    )
  );

  passwordOutput.value = password;
  flake();
  saveToLocalStorage();
}

function scrollToLength( length: number ) {
  const spans = lengthsBand.querySelectorAll( 'span' ),
    lengthS = String( length );

  for ( let i = 0; i < spans.length; i++ ) {
    const span = spans[ i ];
    if ( span.getAttribute( 'data-n' ) !== lengthS ) {
      span.classList.remove( 'selected' );
    } else {
      span.classList.add( 'selected' );
      lengthsBand.style.left = `${ bandContainer.clientWidth / 2 - span.clientWidth / 2 - span.offsetLeft }px`;
    }
  }
}

interface Data {
  lowerCase: boolean,
  upperCase: boolean,
  numbers: boolean,
  symbols: boolean,
  extendedSymbols: boolean,
  similarChars: boolean,
  length: number
}

function saveToLocalStorage() {
  const data: Data = {
    lowerCase: lowerCaseInput.checked,
    upperCase: upperCaseInput.checked,
    numbers: numbersInput.checked,
    symbols: symbolsInput.checked,
    extendedSymbols: extendedSymbolsInput.checked,
    similarChars: similarCharsInput.checked,
    length: lengthInput
  };
  try {
    window.localStorage.setItem( 'snowflake', JSON.stringify( data ) );
  } catch ( e ) { console.log( 'cant save your settings' ); }
}

function loadFromLocalStorage() {
  let dataS: string | null = '';
  try {
    dataS = window.localStorage.getItem( 'snowflake' );
  } catch ( e ) { console.log( 'cant load your settings' ); }

  if ( !dataS ) {
    return;
  }

  const data = <Data> JSON.parse( dataS );
  lowerCaseInput.checked = data.lowerCase;
  upperCaseInput.checked = data.upperCase;
  numbersInput.checked = data.numbers;
  symbolsInput.checked = data.symbols;
  extendedSymbolsInput.checked = data.extendedSymbols;
  similarCharsInput.checked = data.similarChars;
  lengthInput = data.length;
}

const lowerCaseInput = <HTMLInputElement> document.getElementById( 'lowerCase' ),
  upperCaseInput = <HTMLInputElement> document.getElementById( 'upperCase' ),
  numbersInput = <HTMLInputElement> document.getElementById( 'numbers' ),
  symbolsInput = <HTMLInputElement> document.getElementById( 'symbols' ),
  extendedSymbolsInput = <HTMLInputElement> document.getElementById( 'extendedSymbols' ),
  similarCharsInput = <HTMLInputElement> document.getElementById( 'similarChars' ),
  passwordOutput = <HTMLInputElement> document.getElementById( 'password' ),
  bandContainer = <HTMLDivElement> document.getElementById( 'band' ),
  lengthsBand = <HTMLDivElement> document.getElementById( 'lengths' ),
  copyButton = <HTMLSpanElement> document.getElementById( 'copy' );

const spans = lengthsBand.querySelectorAll( 'span' );


let lengthInput = 12;


const snowflake = <CanvasRenderingContext2D>( <HTMLCanvasElement> document.getElementById( 'snowflake' ) ).getContext( '2d' );
snowflake.shadowBlur = 1;
snowflake.shadowColor = snowflake.fillStyle = '#690000';

const inputs = [
  lowerCaseInput,
  upperCaseInput,
  numbersInput,
  symbolsInput,
  extendedSymbolsInput,
  similarCharsInput
];

for ( let i = 0; i < inputs.length; i++ ) {
  inputs[ i ].addEventListener( 'change', generatePasswordFromInput, false );
  // inputs[ i ].addEventListener( 'keydown', e => {
  //   if ( e.key !== 'Enter' ) { return; }
  //   const el = <HTMLInputElement> e.target;
  //   el.checked = !el.checked;
  //   generatePasswordFromInput();
  // }, false );
}


for ( let i = 0; i < spans.length; i++ ) {
  spans[ i ].addEventListener( 'click', e => {
    lengthInput = parseInt( spans[ i ].getAttribute( 'data-n' )! );
    scrollToLength( lengthInput );
    generatePasswordFromInput();
  }, false );
  spans[ i ].addEventListener( 'keydown', e => {
    if ( e.key !== 'Enter' ) { return; }
    lengthInput = parseInt( spans[ i ].getAttribute( 'data-n' )! );
    scrollToLength( lengthInput );
    generatePasswordFromInput();
  }, false );
}

copyButton.addEventListener( 'click', copyToClipboard, false );

window.addEventListener( 'resize', () => scrollToLength( lengthInput ), false );

loadFromLocalStorage();

scrollToLength( lengthInput );
generatePasswordFromInput();