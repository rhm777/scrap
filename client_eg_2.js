var net         =   require ("net")
var trade_t     =   require ( "./trade_t"  );


/*function trd_msg_t ( msg_type , msg_role , msg_obj )
{
    this.msg_type = msg_type;
    this.msg_role = msg_role;
    this.msg_obj  = msg_obj;
}*/


const host = "localhost";
const port = 8080;


const client  =  net.Socket();
var i = 0;
function connect ( port , host , msg )
{
    client.connect ( {port:port,host:host}, function(){
        console.log ("connected with server.");
        client.write ( `Hello server from client...time is now ${new Date().toISOString()}`);
        client.write ( JSON.stringify(msg));    
    });

    client.on ( 'data', function (chunk) {
        //console.log (  `data received from server ${chunk.toString()} time is ${new Date().toISOString()}`);
        client.end();
    });
    client.on ( 'end', function (){
        console.log ( 'request end to the tcp connection.');
    })
}    

var trd  = new trade_t ( "9999", "opt" , "macd");


const trd_msg = new trd_msg_t ( "opt_strt_1", "client", trd );
//const trd_msg   =  { msg_type:"opt_strt_1", msg_role:"client", msg_obj: "abcd" };


//console.log ( trd_msg );
//console.log ( JSON.parse ( JSON.stringify(trd_msg)) );
connect ( port , host ,  trd_msg );

//connect ( port , host );
//connect ( port , host );

