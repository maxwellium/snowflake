export function scrollToPosition(
  container: HTMLDivElement, band: HTMLDivElement, position: number
) {

  const spans = band.querySelectorAll( 'span' ),
    lengthS = String( position );

  for ( let i = 0; i < spans.length; i++ ) {

    const span = spans[ i ];

    if ( span.innerText !== lengthS ) {
      span.classList.remove( 'selected' );
    } else {
      span.classList.add( 'selected' );

      const mq = window.matchMedia( '(max-height: 600px)' );
      if ( mq.matches ) {
        band.style.left = '0px';
        band.style.top = `${ container.clientHeight / 2 - span.clientHeight / 2 - span.offsetTop }px`;
      } else {
        band.style.top = '0px';
        band.style.left = `${ container.clientWidth / 2 - span.clientWidth / 2 - span.offsetLeft }px`;
      }
    }
  }
}

export function setupBandSpans( band: HTMLDivElement, numbers: number[] ) {

  const spans: HTMLSpanElement[] = [];

  //FIXME: also remove eventListeners
  while ( band.lastChild ) {
    band.removeChild( band.lastChild );
  }

  for ( let n of numbers ) {

    const span = document.createElement( 'span' );

    span.innerHTML = String( n );
    band.appendChild( span );
    spans.push( span );
  }

  return spans;
}