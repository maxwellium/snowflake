import { getRandomArray } from '../src/js/crypto';

export interface Distribution {
  [ c: string ]: number
};

self.addEventListener( 'message', onMessage );

function onMessage( message: MessageEvent ) {
  const {
    pool,
    iterations,
    minLength,
    maxLength
  } = message.data;

  const distribution = run( pool, iterations, minLength, maxLength );

  ( self as unknown as Worker ).postMessage( {
    command: 'done',
    distribution: distribution
  } );
}

function run(
  pool: string,
  iterations: number,
  minLength: number,
  maxLength: number
) {

  const distribution: Distribution = {},
    poolArray = pool.split( '' );

  poolArray.reduce( ( d, c ) => { d[ c ] = 0; return d; }, distribution );

  for ( let i = 0; i < iterations; i++ ) {

    const length = Math.random() * ( maxLength - minLength ) + minLength;
    const randoms = getRandomArray( length, pool.length );

    for ( let i2 = 0; i2 < randoms.length; i2++ ) {
      distribution[ pool[ randoms[ i2 ] ] ]++;
    }
  }

  return distribution;
}

