// daily work.
// A-Z freenlancer.
// A-Z passive income.
// create profiles with handover using bit.ly. hence the target page.
// use facebook sites to create follow and like and friend request.
// use automation to send repetitive messages.
// intro: i offer .... services a super competitive prices...
//        all tasks are escrowed. free initial consultation.
//        some intro about facebook marketing.. about local marketing...
// find tasks that you want to introduce.  
// do you want to go into .... but cost ....
// or you want to learn ... current market ..... tecnologies... which
// can benefit your .... 
// domestika.org , midjourney, chatgpt, sharli, quillbot, notion ai.
// adobe firefly , imageLarger, udly ai.
// eureka io.

var net       =  require ( "net" );
var { socket_server , socket_connection } = require("./socket_server_1");
const { Worker, isMainThread } = require ( "worker_threads" )
/*
let socket_client   =   function ( dest_host , dest_port  )
{
    this.dest_host  = dest_host;
    this.dest_port  = dest_port;
    this.socket     = new net.Socket();
    this.socket.connect ( {port:this.dest_port, host:this.dest_host} );
    
    console.log ( " connected with server " + this.dest_host + " port:" + this.dest_port );
   
    this.socket.on ( "data" , this.receive_data   );
    this.socket.on ( "end" , this.connection_close );
    this.socket.on ( "error" , this.connection_err );
}; 

socket_client.prototype.end_connection    =  function ( )
{
    this.socket.end ();
}

socket_client.prototype.connection_err    =  function ( err )
{
    // console.log ( err.message )
}

socket_client.prototype.receive_data = function ( data )
{
    // let message_obj      =  JSON.parse ( data );
    // let app_obj          =  message_obj.app_obj;
    // console.log ( message_obj );
    // console.log ( app_obj );   
    this.socket.write ( data )
}

socket_client.prototype.send_data = function ( data )
{
    // let message_obj      =  JSON.parse ( data );
    // let app_obj          =  message_obj.app_obj;
    // console.log ( message_obj );
    // console.log ( app_obj );   
    this.socket.write ( data )
}
let s_c = new socket_client ( "127.0.0.1", 3001 )
*/

//var {socket_connection}  = require("./socket_server_1")
/*
var client = new net.Socket();
client.connect ( 3001, '127.0.0.1', function() {
	console.log('Connected');
	client.write('93 + 29');
});

client.on('data', function(data) {
	console.log('\r\n----Received: ' + data);
	//client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
*/

class socket_client 
{
    constructor ( host , port , client_impl_name )
    {
        this.host = host
        this.port = port
        this.client_impl_name = client_impl_name
    }

    on_connection ( )
    {
        console.log ( "[client] connected at " + this.host + ":" + this.port )
    }
    start ()
    {
        this.client = new net.Socket();
        this.client.setNoDelay(true)
        this.client.connect ( this.port, this.host , this.on_connection.bind(this) )
        let client_ins   =  this.client_impl_name.get_instance ( this.client )
        this.socket_conn_impl = client_ins
        this.client.on('data', function(data) {
            //console.log('\r\n[socket_client]----Received: ' + data);
            client_ins.on_data ( data )
            this.data_recvd = 1
            //client.destroy(); // kill client after server's response
        });
        
        this.client.on('close', function() {
            client_ins.on_close()
            console.log('Connection closed');
        });
    }
    send_msg ( message )
    {
        console.log ( "data_recvd: " +this.data_recvd )
        this.socket_conn_impl.send_msg ( message )   
    }
    close ( )
    {
        this.socket_conn_impl.close()
    }
}


   

module.exports = { socket_client , socket_connection }

//const worker1 = new Worker ( "./twtr_pst_queue.js" )
//worker1.on ( "message", ( j ) => { console.log("received: " + String(j) ) } )
/*
async function delay ( time )
{
    return new Promise (  res => {
        setTimeout(res,time)
      } )
}
async function runService ( worker_data )
{
    //const worker = new Worker("./twtr_pst_queue.js", {"message":worker_data});
    const worker = new Worker("./twtr_pstr_wrkr.js" );
    obj = { "key_1":"value_1", "key_2":"value_2"}
    obj2 = { "key_1":"obj_value_1", "key_2":"obj_value_2"}
    
    worker.postMessage ( obj  )
    await delay ( 5000 )
    worker.postMessage ( obj2  )
    
    //obj["key_1"] = "vl_1"
    //worker.postMessage ( obj  )
    
    
//    worker.postMessage ( "exit" )
    //worker.postMessage ( "three times" )
    //worker.postMessage ("pop")
    //worker.postMessage ("pop")
    //worker.postMessage ("pop")
    //worker.postMessage ("pop")
    //worker.postMessage ( "exit" )

    worker.on("message" , incoming=>
        { 
            console.log("received:" + incoming ) 
           // worker.postMessage ( obj  )
            
        }
    )
    worker.on("error" , code=>console.log(`worker stopped with exit code ${code}`))
    worker.on("exit" , code => console.log( "worker has stopped..." + code ))
    //setTimeout(() => worker.postMessage("you won't see me"), 100);
}
async function run ( )
{
    const result = runService ( "lets begin" )
    console.log ( {isMainThread} );
}
run().catch(err=>console.error(err))
*/


//let obj = {}
//obj["key_1"] = "val_1";
//obj["key_2"] = "val_2"
//let str = "[object]   -" + JSON.stringify(obj)
//console.log ( str )
//s   =  str.replace ("[object]","").trim()
//console.log( s )
//console.log (typeof(str))
//console.log( str )
//ob = JSON.parse(str)
//console.log ( ob ["key_2"])


/*
class mod
{
    constructor(val)
    {
        this.val = val;
    }
    get_val ()
    {
        return this.val;
    }
}
m = new mod(13)
f = m.get_val
//console.log ( f() )
g = f.bind ( m )
console.log ( g() )*/
