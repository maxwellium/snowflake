import { Distribution } from './worker';

export function statsFromDistribution( distribution: Distribution ) {

  const values: { c: string, count: number, fromMedian: number }[] = [];

  let sum = 0,
    count = 0,
    median = 0;

  for ( let c in distribution ) {
    sum += distribution[ c ];
    count++;
  }

  median = sum / count;

  for ( let c in distribution ) {
    values.push( {
      c,
      count: distribution[ c ],
      fromMedian: distribution[ c ] - median
    } );
  }

  return { sum, count, median, values };
}


export function sortTable( table: HTMLTableElement, index: number, numeric = true ) {
  let switching = true,
    shouldSwitch = false,
    rows: HTMLCollectionOf<HTMLTableRowElement>,
    i: number,
    x: HTMLTableDataCellElement,
    y: HTMLTableDataCellElement;


  while ( switching ) {
    switching = false;
    rows = table.rows;
    for ( i = 1; i < ( rows.length - 1 ); i++ ) {
      shouldSwitch = false;
      x = <HTMLTableDataCellElement> rows[ i ].getElementsByTagName( 'TD' )[ index ];
      y = <HTMLTableDataCellElement> rows[ i + 1 ].getElementsByTagName( 'TD' )[ index ];

      if ( numeric ) {
        if ( parseFloat( x.innerText ) > parseFloat( y.innerText ) ) {
          shouldSwitch = true;
          break;
        }
      } else {
        if ( x.innerText.toLowerCase() > y.innerText.toLowerCase() ) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if ( shouldSwitch ) {
      rows[ i ].parentNode!.insertBefore( rows[ i + 1 ], rows[ i ] );
      switching = true;
    }
  }
}