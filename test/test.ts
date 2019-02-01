import { getRandomArray } from '../src/js/crypto';
import { POOL } from '../src/js/pool';

let pool = Object.keys( POOL ).map( k => POOL[ k ] ).join( '' ),
  minLength = 4,
  maxLength = 32,
  iterations = 1000000;

const table = <HTMLTableElement> document.getElementById( 'table' ),
  runButton = <HTMLButtonElement> document.getElementById( 'run' ),
  sortButton = <HTMLButtonElement> document.getElementById( 'sort' );

async function run() {

  const distribution: { [ c: string ]: number } = {},
    poolArray = pool.split( '' );

  poolArray.reduce( ( d, c ) => { d[ c ] = 0; return d; }, distribution );

  for ( let i = 0; i < iterations; i++ ) {

    const length = Math.random() * ( maxLength - minLength ) + minLength;
    const randoms = await getRandomArray( length, pool.length );

    for ( let i2 = 0; i2 < randoms.length; i2++ ) {
      distribution[ pool[ randoms[ i2 ] ] ]++;
    }
  }

  for ( let c of poolArray ) {
    const row = table.insertRow();
    row.insertCell().innerText = c;
    row.insertCell().innerText = String( distribution[ c ] );
  }
}



function sort() {
  let rows, switching, i, x, y, shouldSwitch;
  switching = true;
  while ( switching ) {
    switching = false;
    rows = table.rows;
    for ( i = 1; i < ( rows.length - 1 ); i++ ) {
      shouldSwitch = false;
      x = rows[ i ].getElementsByTagName( "TD" )[ 1 ];
      y = rows[ i + 1 ].getElementsByTagName( "TD" )[ 1 ];
      if ( parseInt( x.innerHTML ) > parseInt( y.innerHTML ) ) {
        shouldSwitch = true;
        break;
      }
    }
    if ( shouldSwitch ) {
      rows[ i ].parentNode!.insertBefore( rows[ i + 1 ], rows[ i ] );
      switching = true;
    }
  }
}

runButton.addEventListener( 'click', run, false );
sortButton.addEventListener( 'click', sort, false );
