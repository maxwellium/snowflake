import { Data } from './persistence';
import { getPool } from './pool';

export function generatePassword( length: number, pool: string ) {
  return getRandomArray( length, pool.length )
    .map( n => pool[ n ] )
    .join( '' );
}

export function getRandomArray( length: number, max: number ): number[] {
  /** 
   * yes, i know we're losing some randomness by dividing 1 / r;
   * however rejection sampling just ain't pretty ;D 
   * – jk, see the test in /test
   **/
  return Array
    .from(
      window.crypto.getRandomValues(
        new Uint32Array( length )
      ) )
    .map(
      i => Math.floor(
        i / ( 0xffffffff + 1 ) * max
      )
    );
}


export function generatePasswordFromInput( data: Data ) {
  return generatePassword(
    data.length,
    getPool(
      data.lowerCase,
      data.upperCase,
      data.numbers,
      data.symbols,
      data.extendedSymbols,
      data.similarChars,
    )
  );
}