export interface Data {
  lowerCase: boolean,
  upperCase: boolean,
  numbers: boolean,
  symbols: boolean,
  extendedSymbols: boolean,
  similarChars: boolean,
  length: number
}

export function saveToLocalStorage( data: Data ) {
  try {
    window.localStorage.setItem( 'snowflake', JSON.stringify( data ) );
  } catch ( e ) { console.log( 'cant save your settings' ); }
}

export function loadFromLocalStorage() {
  let dataS: string | null = '';
  try {
    dataS = window.localStorage.getItem( 'snowflake' );
  } catch ( e ) { console.log( 'cant load your settings' ); }

  if ( !dataS ) {
    return null;
  }

  return <Data> JSON.parse( dataS );
}