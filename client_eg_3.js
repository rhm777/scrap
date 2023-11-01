const { ClientRequest } = require("http");

const trade_t         = require ("./trade_t");

var net = require ( "net" )

const host = "localhost";
const port = 7788;

function trd_msg_t ( msg_type , msg_role , msg_obj )
{
    this.msg_type = msg_type;
    this.msg_role = msg_role;
    this.msg_obj  = msg_obj;
}

const client  =  net.Socket();
var i = 0;
function connect ( port , host , msg )
{
    client.connect ( {port:port,host:host}, function(){
        console.log ("connected with server.");
        //client.write ( `Hello server from client...time is now ${new Date().toISOString()}`);
        //client.write ( JSON.stringify(msg));    
    });

    client.on ( 'data', function (data) {
        //console.log (  `data received from server ${chunk.toString()} time is ${new Date().toISOString()}`);
        const dat   =  JSON.parse ( data );
        console.log ( dat );
        console.log ( dat.cmd );
        
        /*client.write ( JSON.stringify ( 
            {
            "cmd_": "getuserlistfrom",
              stn_1: true,
            "value1" : 337,
            tm_1      : Date.now(),
            "tm_str_1"  : new Date().toISOString(),
            }    ) );
            */
        var trd  = new trade_t ( "9999", "opt" , "macd");
        const trd_msg   =  { msg_type:"opt_strt_1", msg_role:"client", msg_obj: trd  , msg_tm: Date.now(), msg_tm_str:new Date().toISOString()};
        //var trd_obj  =  trd_msg.msg_obj;
        //const trd_msg   =  new trd_msg_t ( "opt_strt_1", "client", "trd_obj" );
        client.write ( JSON.stringify ( trd_msg ) );    
        client.end();
    });
    client.on ( 'end', function (){
        console.log ( 'request end to the tcp connection.');
    })
}    
connect ( port , host );