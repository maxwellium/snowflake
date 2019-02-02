import { POOL } from '../src/js/pool';
import { Distribution } from './worker';
import { statsFromDistribution, sortTable } from './helper';

let pool = Object.keys( POOL ).map( k => POOL[ k ] ).join( '' ),
  minLength = 4,
  maxLength = 32,
  iterations = 100000;

const table = <HTMLTableElement> document.getElementById( 'table' ),
  runButton = <HTMLButtonElement> document.getElementById( 'run' ),
  sortChar = <HTMLTableHeaderCellElement> document.getElementById( 'sortChar' ),
  sortCount = <HTMLTableHeaderCellElement> document.getElementById( 'sortCount' ),
  sortDistance = <HTMLTableHeaderCellElement> document.getElementById( 'sortDistance' ),
  countSpan = <HTMLSpanElement> document.getElementById( 'count' ),
  sumSpan = <HTMLSpanElement> document.getElementById( 'sum' ),
  medianSpan = <HTMLSpanElement> document.getElementById( 'median' );

const worker = new Worker( 'worker.js' );


function run() {

  runButton.disabled = true;

  function handleWorkerCompletion( message: MessageEvent ) {

    if ( message.data.command !== 'done' ) {
      return;
    }

    worker.removeEventListener( 'message', handleWorkerCompletion );
    runButton.disabled = false;

    const distribution: Distribution = message.data.distribution;

    const stats = statsFromDistribution( distribution );

    while ( table.rows.length > 1 ) { table.deleteRow( -1 ); }
    for ( let value of stats.values ) {
      const row = table.insertRow();
      row.insertCell().innerText = value.c;
      row.insertCell().innerText = String( value.count );
      row.insertCell().innerText = value.fromMedian.toFixed( 2 );
    }

    sumSpan.innerText = String( stats.sum );
    countSpan.innerText = String( stats.count );
    medianSpan.innerText = stats.median.toFixed( 2 );
  }

  worker.addEventListener( 'message', handleWorkerCompletion, false );
  worker.postMessage( {
    pool,
    iterations,
    minLength,
    maxLength
  } );
}



runButton.addEventListener( 'click', run, false );
sortChar.addEventListener( 'click', () => sortTable( table, 0, false ), false );
sortCount.addEventListener( 'click', () => sortTable( table, 1 ), false );
sortDistance.addEventListener( 'click', () => sortTable( table, 2 ), false );