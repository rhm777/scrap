// the instance of it will provide thread.wait of c language.

const common_lib  =  require ("./common_lib");
const queued_consumer = require ( "./queued_consumer");
const event_receiver = require ( "./event_receiver");

// queued consumer or multiplexer .. which dispatches.
// calling this will hanged due to ...

function consumer_producer ( max_cnt_req  )
{
    this.obj_arr      =  [];
    this.max_cnt_req  =  max_cnt_req;
    this.resolver =  null;
    if ( this.max_cnt_req == undefined ) 
         this.max_cnt_req = 40;
}
// usually queue full error means queue size is small.
// lot of load for the queue.
// it should be written to some file. or
// written to log file.

consumer_producer.prototype.produce  = async function ( obj )
{

    if ( this.obj_arr.length == this.max_cnt_req ){
        console.log ( " queue is full....")
        return false;
    }
    this.obj_arr.push ( obj );
    if ( this.resolver )  
         await this.resolver();    // resolving this will untied waitng cnsmr.
    return true;

}

consumer_producer.prototype.consume  =  async function ( )
{ 
    if ( this.obj_arr.length == 0 )
        {
             let consumer_promise = new Promise( (resolve,err) => {
                    //console.log ( " setting resolve in consumer ... ");
                    this.resolver = resolve;

                    if ( this.obj_arr.length >  0) 
                        throw new Error( "there was error in this logic.")
             });
             await consumer_promise;
        }
    this.resolver  =  null;
    return this.obj_arr.shift();
}
module.exports = consumer_producer

/*
let c_p  = new consumer_producer ( 100 );
// implement 3 consumer as consumer_producer.
let queue_cons = new queued_consumer ( 100 , c_p );
let event_receiver_1  = new event_receiver ( "receiver_1")
queue_cons.add_listener ( event_receiver_1 );
let event_receiver_2  = new event_receiver ( "receiver_2")
queue_cons.add_listener ( event_receiver_2 );
let event_receiver_3  = new event_receiver ( "receiver_3")
queue_cons.add_listener ( event_receiver_3 );
let event_receiver_4  = new event_receiver ( "receiver_4")
queue_cons.add_listener ( event_receiver_4 );
queue_cons.consume ( );
*/

/*
setTimeout ( async () => {   // consumer.
    while ( true )
    {
        let item = await c_p.consumer ( );
        console.log ( "************************item consumed ... " );
        console.log ( item );
        console.log ( "" )
        console.log ( "" )
        await common_lib.sleep ( Math.random()*100 );
    }
},0)
*/
/*
setTimeout ( async () => {   // producer.
    let i =   0;
    while ( true )
    {
        let item = { index:i, open_time: new Date().toISOString(), open_prc : (3 + Math.random())}
        //console.log ( item == item );
        //item.index++;
       // console.log ( item == item );
        let res = await c_p.produce ( item );
        if ( res !== true )
        {
            console.log ( " item failed .... index: " + item.index  ); 
        }
        else { 
            console.log ( "==============>item was produced ... length:" + c_p.obj_arr.length + " index: " + item.index);
            i++;
        }
        
        await common_lib.sleep ( Math.random()*500 );
        //i++;
    }
}, 0 );

*/



/*
common_lib.sleep ( 10000 ).then ( ()=>{
    console.log ( "hello" );
})*/





