/* 
    distribute_message by class.
    send_data to all attached sockets.
    receive data.

    all sending is done by app_obj , message_obj_wrapper , then message_wrapper.
    use message_obj only.


*/

const  net   =  require ( "net" );
const  fs               = require ( "fs" );
const  path             = require ( "path" );
const message_obj = require("./message_obj");

const  server_trd_msg_forwarder  =  function ( host , port )
{   // logs the messages.
    this.sockets_list      =  [];
    this.sockets_map       =  new Map();
    this.sockets_cntx_map  =  new Map();
    this.host  = host; this.port = port;
    this.server            =  net.createServer();
    
    this.data_folder = path.join (__dirname + "/data_folder/" );
    if ( !fs.existsSync(this.data_folder) )
        fs.mkdirSync( this.data_folder );
        

}

server_trd_msg_forwarder.prototype.get_id = function ( socket )
{
    return socket.remoteAddress + "_" + socket.remotePort;    
}

// send data to single socket.
server_trd_msg_forwarder.prototype.send_data_all       = function ( msg_type , msg_role , msg_cntx , obj )
{
    let  msg_obj     =   message_obj ( msg_type , msg_role , msg_cntx , obj  );
    for ( let i = 0; i < this.sockets_list.length; i++ )
    {
        this.sockets_list[i].write ( JSON.stringify ( msg_obj ) );
    }
}

server_trd_msg_forwarder.prototype.send_data       = function ( socket, msg_type , msg_role , msg_cntx , obj )
{
    let data        =  "data sended to  " + socket.get_id() + " time: " + Date.now() + " ts:" + new Date().toLocaleString() + "\r\n";
    fs.appendFileSync ( socket.data_log_file , data + "\r\n");
    let  msg_obj     =   message_obj ( msg_type , msg_role , msg_cntx , obj  );
    socket.write ( JSON.stringify ( msg_obj ) );
}

server_trd_msg_forwarder.prototype.data_receive    = function ( socket , msg_obj , app_obj )
{
      console.log ( "=============>new message from socket: " + socket.get_id()  )
      if ( on_data_recv )
         on_data_recv  ( socket , msg_obj , app_obj );
}

server_trd_msg_forwarder.prototype.on_socket_close    = function ( socket )
{
    //console.log ( " --------------> connection closing for " + this.get_id(socket) );
    if ( on_conn_closing  )
         on_conn_closing ( socket );
}
server_trd_msg_forwarder.prototype.run  = function ()
{
    this.server.listen ( this.port , this.host , function() {
         console.log ("*server listening at host ..."  );   
    });
    console.log ("server listening at host " + this.host + " --- port " + this.port ); 
    var prev_this = this;
    this.server.on ( "connection" , function ( socket ) {   // *** new connection has arrived.
        socket.get_id  = function ( ) { return this.remoteAddress + "_" + this.remotePort ;}
        socket.data_log_file = prev_this.data_folder + socket.get_id() + ".txt";
        socket.par_this  = prev_this;
        socket.send_data = function ( msg_type, msg_role , msg_cntx , app_obj )
        {
            let msg_obj  =  message_obj ( msg_type , msg_role , msg_cntx , app_obj );
            this.write ( JSON.stringify ( msg_obj ));
        }
       // console.log ( " new socket has arrived " + prev_this.get_id(socket)   );
        socket.on  ( 'data' , function ( data ){
               // console.log ( " data arrive from socket: " + socket.get_id() );
                //console.log ( data.toString() );
                let msg_obj = JSON.parse ( data );
                let app_obj   = msg_obj.app_obj;
                if ( msg_obj.msg_role=="receiver" && prev_this.is_receiver_new (socket , msg_obj.msg_cntx ) )
                {   prev_this.add_new_socket ( socket , msg_obj.msg_cntx  );
                  //  prev_this.print_state();
                }
                if ( msg_obj.msg_role == "receiver") // for receiver accumulate sockets.
                {
                    let data       =  "---------------> data arrived for socket:" + socket.get_id() + " -- tm:" + Date.now() + " tm_str:" + new Date().toLocaleString() + "\r\n";
                    fs.appendFileSync ( socket.data_log_file , data );
                    prev_this.data_receive ( this , msg_obj , app_obj );
                }
                else if ( msg_obj.msg_role == "sender" ) // for sender distribute data to sockets.
                {
                    prev_this.distribute_message ( this , msg_obj , app_obj );
                }
        });
        socket.on  ( "end", function (){
            prev_this.on_socket_close ( this );
            prev_this.remove_socket ( this );
            //prev_this.print_state ( );
})


    });
}
// used when external distribution message is received.
// otherwise socke.par_this.send_data is used.
server_trd_msg_forwarder.prototype.distribute_message = function ( src_socket , msg_obj , app_obj )
{
    let  msg_cntx    =      msg_obj.msg_cntx;
    // send to all msg_cnt  the object obtain in msg_obj.
    let sock_arr  =  this.sockets_cntx_map.get ( msg_cntx );
    for ( let i = 0; i < sock_arr.length; i++ )
    {   
       let sock   =   sock_arr[i];      // the current destination sock.
      // console.log ( "sending to " + sock.get_id() );
       sock.send_data ( msg_obj.msg_type , msg_obj.msg_role , msg_obj.msg_cntx , app_obj )
    }
}

server_trd_msg_forwarder.prototype.print_state = function (  )
{   
    //console.log ( "-------------------->***list.length:" + this.sockets_list.length + " -- id_map.size:" + this.sockets_map.size );
    for ( const [key,value] of this.sockets_cntx_map )
    {
        console.log ( " cntx_map.key " + key + " --- length:" + value.length );
    }    
}
server_trd_msg_forwarder.prototype.is_receiver_new = function ( socket )
{   // check is socket_map.
    let  client_id = socket.get_id  (  );
    if ( this.sockets_cntx_map.has ( client_id ) )
         return false;
    return true;
}


server_trd_msg_forwarder.prototype.add_new_socket = function ( socket , msg_cntx )
{
    socket.msg_cntx    =     msg_cntx ;
    this.sockets_list.push ( socket );
    this.sockets_map.set ( socket.get_id() , socket );
    if ( this.sockets_cntx_map.has ( msg_cntx) == false )
        {
            let new_arr = []; this.sockets_cntx_map.set ( msg_cntx , new_arr );
        };
    let sock_arr    =    this.sockets_cntx_map.get ( msg_cntx ) ;
    sock_arr.push ( socket );  
    let data        =  "new connection arrived from " + socket.get_id() + " time: " + Date.now() + " ts:" + new Date().toLocaleString() + "\r\n";
    fs.appendFileSync ( socket.data_log_file , data + "\r\n");

}

server_trd_msg_forwarder.prototype.remove_socket = function ( socket )
{   
//   console.log ( " removing from scoket: " + socket.remoteAddress + " --- " + socket.remotePort );
    // remvoe from socket_map.
    let client_id   =  socket.get_id();
    this.sockets_map.delete ( client_id );   
    
    // remove from sockets_list.
    var index  =  this.sockets_list.findIndex ( (ele) => {
           return ( (ele.remotePort == socket.remotePort) ) 
        })
  //  console.log  (" ====================> index is "  + index );
    let last_sock = this.sockets_list[index];
    let msg_cntx      = last_sock.msg_cntx;
    if ( index != -1  )
    {
        this.sockets_list.splice ( index , 1 );
       // console.log ( " msg_cntx was " + last_sock.msg_cntx );
        let sock_arr = this.sockets_cntx_map.get (last_sock.msg_cntx);
        //sock_arr.forEach ( (ele) => console.log ( ele.msg_cntx + "--" + ele.get_id()) );
        let new_index   =  sock_arr.findIndex ( (ele) => ele.remoteAddress==socket.remoteAddress && ele.remotePort == socket.remotePort)
       // console.log ( new_index + "--- id:" + sock_arr[new_index].get_id() );
        sock_arr.splice ( new_index , 1 );
    }
    let data        =  "connection deleted from " + socket.get_id() + " time: " + Date.now() + " ts:" + new Date().toLocaleString() + "\r\n";
    fs.appendFileSync ( socket.data_log_file , data + "\r\n");
}



let server = new server_trd_msg_forwarder ( '127.0.0.1' , 1317 );
server.run();



function on_data_recv ( socket , msg_obj , obj )
{
 //   console.log ( "obj receivd from client " );
    //console.log ( "[on_data_receiv] trade obj is ", obj );
  //  console.log ( msg_obj ); //console.log ( obj );
    var sig = { sig_name: "first_sig" , sig_id : Date.now() }
    socket.par_this.send_data ( socket , "opt" , "sender" , "opt_strategy_1" , sig );
}

function on_conn_closing ( socket )
{
  //  console.log ( " -----------------------------> client socket closed for " + socket.remoteAddress + "_" + socket.remotePort );
    
    //this.print_state ();
}
