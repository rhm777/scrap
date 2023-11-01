


var trade_t  =  require ( "./trade_t" );

const trd = new trade_t ( 12345 , "opt", "macd" ); //, Date.now(), 0, 1.3051 , 0 , "macd", "opt trd 1" );

//trd.print();
console.log ( trd );
console.log ( JSON.stringify ( trd ) );
var trd_json = JSON.stringify ( trd );
var trd_ = JSON.parse ( trd_json );
console.log ( trd_ );
// today:
// implement 
//  server ....
//  implement client of it.
//  trd_msg_forwarder.
//   


