// implement call back queue. 
// using locks. mutex semaphore.
//


function process_cb ( t,cb )
{
    //setTimeout ( ()=>{ cb("reslt task completed in:" + t)}, t );
    for( let i =0; i < 100000000; i++ );
    cb("reslt task completed in:" + t)
    return   "process completed"
}
/*
process_cb(10000, function ( data ) { console.log(data); }  )
console.log ( "i should precede");
*/
let rand_arr = [];
for ( let i =0; i < 10; i++ )
    rand_arr.push ( Math.floor ( 1000+Math.random()*10000) );
function process ( rand_arr )
{
    for ( let i = 0; i < rand_arr.length; i++ )
    {
        process_cb ( rand_arr[i] , my_func )
    }
}
function my_func ( data ){console.log (data);}
console.log  (rand_arr );
process ( rand_arr );


