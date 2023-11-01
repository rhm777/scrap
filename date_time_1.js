let common_lib = require ( './common_lib');
// add of hours.
let now = new Date();
//now.setMilliseconds(0)
/*let now_2 = new Date(now);
let ml = now_2.getTime()+(3*60*60*1000)
now_2.setTime ( ml );
console.log ( now );
console.log ( now_2 );
*/

console.log ( now );
now.add_hours ( 7 )
let now_2 = now.get_copy ( now );
now_2.add_days ( 7 );
console.log ( now  );
console.log ( now_2 )


let tm_local = new Date().toISOString();
let tm_local_1 = new Date().toLocaleTimeString();
let tm_local_2 = new Date().toLocaleString();
let tm_local_3 = new Date().toLocaleDateString();


console.log  (" --- " + tm_local + " --- "  + tm_local_1 );
console.log  ( "[" + tm_local_2 + "] --- " + tm_local_3 );
now = new Date();  let epoch  =  new Date(0);
now.add_hours ( 12 )
let tm_str_1 = now.toString()
let tm_str_2 = now.toLocaleString()
console.log ( "full mil time w zone: " + now );
console.log ( "locale string(non-mil): "  + now.toLocaleString() )
console.log ( "time stamp: " + now.getTime() )
console.log ( "epoch time: " + epoch );

console.log ( " ---- " );
console.log ( " ---mil-time "  + new Date(tm_str_2).toString() );
console.log ( " --- " + new Date(tm_str_1).toLocaleString()  );
