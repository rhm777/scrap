const net       =  require ( "net" );
const trade_t   =  require ( "./trade_t" );
const message_obj      = require ( "./message_obj" );

let test_client   =   function ( dest_host , dest_port  )
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

test_client.prototype.end_connection    =  function ( )
{
    this.socket.end ();
}

test_client.prototype.connection_err    =  function ( err )
{
     console.log ( err.message )
}
test_client.prototype.connection_close  =  function ( )
{
     console.log ( " connection is now closing ... " )
}

test_client.prototype.receive_data = function ( data )
{
     let message_obj  =  JSON.parse ( data );
     let app_obj          =  message_obj.app_obj;
    // console.log ( message_obj );
    // console.log ( app_obj );   
}

// msg_cntx should be strategy name.
test_client.prototype.send_data = function ( msg_type ,  msg_role , msg_cntx , app_obj )
{
    const msg_obj    =   message_obj ( msg_type ,  msg_role , msg_cntx , app_obj );
    msg_obj.app_obj  =   app_obj;
    this.socket.write ( JSON.stringify ( msg_obj ) );
}

function send () {
    const  tc   = new test_client ( '127.0.0.1', 1317 );
    var sig     = { sig_name:"new_sig_macd_1", status: "expired" } 
    tc.send_data ( "opt", "sender" , "opt_strategy_1" , sig );
}

for ( let i = 0; i < 1; i++ )
      send ();
//setTimeout ( send , 0 );


