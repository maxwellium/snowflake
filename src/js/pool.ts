export const POOL: { [ t: string ]: string } = {
  lowerCase: 'abcdefghijklmnopqrstuvwxyz',
  upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!#$%&*+-=?@^_',
  extendedSymbols: '{}[]()\/\'"`~,;:.<>\\|'
};

export function getPool(
  lowerCase: boolean,
  upperCase: boolean,
  numbers: boolean,
  symbols: boolean,
  extendedSymbols: boolean,
  similarChars: boolean
) {
  let pool =
    ( lowerCase ? POOL.lowerCase : '' ) +
    ( upperCase ? POOL.upperCase : '' ) +
    ( numbers ? POOL.numbers : '' ) +
    ( symbols ? POOL.symbols : '' ) +
    ( extendedSymbols ? POOL.extendedSymbols : '' );

  if ( !similarChars ) {
    pool = pool.replace( /[iloIO01]/g, '' );
  }

  return pool;
}