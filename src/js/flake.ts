export function flake( snowflake: CanvasRenderingContext2D ) {
  snowflake.shadowBlur = 1;
  snowflake.shadowColor = snowflake.fillStyle = '#690000';
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
