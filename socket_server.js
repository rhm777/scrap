// implement trade_sender using that api.
// implement generic  forwarding_server....
// implement trade_forwarder_server  using forwarding server
//      by abstracting iamsender iamreceiver 
// implement trade_receiver for above. which will be part of platform.
// extend trade_forwarder for multiple request type and multiple receivers.


const  net              =  require ( "net" );
const  fs               =  require ( "fs" );
const  path             =  require ( "path" );
//const  message_obj      =  require("./message_obj");
let    socket_wrapper   =  require ("./net/socket_wrapper")

// abstracts out listening of server and data recieving and sending.
// note: msg_obj etc is implementation specific.
// it only implements string sending , object sending using json.
// server also uses socket_wrapper to send the data to.
// it exports following function.
//    constructor  //   send_str.  send_obj.   
//    all sockets are socket_wrapper list.
//    socket.on ("data") if underlying socket has sended data.
//    and to set reply mechanism for this data using implementation.
//    

// on_new_connection

function socket_server ( host_str , port_int , serv_impl )
{
    this.host  =  host_str;
    this.port  =  port_int;
    this.serv_impl  =  serv_impl;
    this.socket_list  =  new Array(); // socket_list is used for broadcasting.
    this.socket_map   =  new Map ();  // uses socket_id, for external implementation.
    this.start_listen  ( )
    this.run ( );   
}
socket_server.prototype.print       =  function ( )
{
    console.log ( " -----   ") 
    console.log ( " -----   ") 
   
    console.log ( `server listening ${this.host}:${this.port} `)
}

socket_server.prototype.get_id        =  function ( )
{
    return "not implemented"
}

socket_server.prototype.start_listen  =  function ( )
{
    this.server   =   net.createServer()
    this.server.listen ( this.port , this.host )
    
    this.print ( );
    
}

socket_server.prototype.process_new_connection  =  function ( socket )
{
    socket.get_id       =   function() { return this.remoteAddress + "_" + this.remotePort }
    let client_socket   =   new socket_wrapper ( socket );
    this.save_new_connection ( client_socket   );
    socket.par_this = this;
    socket.on("data", this.on_socket_data      );
    socket.on("end" , this.on_connection_close );
    this.serv_impl.on_new_connection ( client_socket );

}  

socket_server.prototype.save_new_connection = function ( client_socket )
{
    let socket_id  =  client_socket.get_id()
    if ( this.find_connection ( socket_id )  )  // if this socket already exists.
    {
        this.remove_connection ( client_socket )
    }
    // register or re/register the client_socket.
    this.socket_list.push ( client_socket )
    this.socket_map.set ( client_socket.get_id() , client_socket )
}

socket_server.prototype.find_connection     =  function ( socket_id  )
{
    let client_socket  =  this.socket_map.get ( socket_id );
    return client_socket;
}



socket_server.prototype.on_socket_data =    function ( data )
{    // this = socket.   
     // read socket_wrapper from the list.
     let socket_id = this.remoteAddress + "_" + this.remotePort; //new socket_wrapper().get_id_from_socket ( socket )
     console.log ( "some socket client has send data from id: " + socket_id );
     //console.log  ( data.toString() );
     let client_socket  =  this.par_this.find_connection ( socket_id );
     //client_socket.send_object ( "{id:socket_id, message:thankyou}");
     let obj  =  JSON.parse ( data )
     //console.log ( obj )
     this.par_this.serv_impl.on_data_received ( client_socket , obj  );
     this.par_this.print();
}

socket_server.prototype.on_connection_close =    function (  )
{
     let socket       = this;   // net api provides call back using emit('end')/sckt is cntx.
     let this_        = socket.par_this;
   //  console.log ( "length socket_lsit: " +  this_.socket_list.length )
   //  console.log ( "length socket_map.size: " + this_.socket_map.size )
     
     // read socket_wrapper from the list.
     //let socket_id = this.remoteAddress + "_" + this.remotePort; //new socket_wrapper().get_id_from_socket ( socket )
     console.log ( "some socket client has been closed: " + socket.get_id() );
     let client_socket  =  this_.find_connection ( socket.get_id() )
     this_.remove_connection ( client_socket )
     // remove from socket_map.
     
     // remove from list.
     //console.log  ( data.toString() );
     //let client_socket  =  this.par_this.find_connection ( socket_id );
     //client_socket.send_object ( "{id:socket_id, message:thankyou}");
     //this.par_this.serv_impl.on_data_received ( client_socket , data  );
     //this.par_this.print();
     
}
socket_server.prototype.remove_connection   =  function ( client_socket )
{
    let client_id   =  client_socket.get_id();
    console.log ( "===================>removing client_id: " + client_id )
    console.log ( "length socket_list: " +  this.socket_list.length )
    console.log ( "length socket_map.size: " + this.socket_map.size )
   // let client_socket   =   this.socket_map.get ( client_id )
    console.log ( " cl sock: " + client_id )
    this.serv_impl.on_connection_close ( client_socket )
  
    let index  =  this.socket_list.findIndex ( (ele) => {
    console.log ( " addrss: " +  client_socket.getRemoteAddress() + " -- " + ele.getRemoteAddress() + " -- socket remoteport:" + client_socket.getRemotePort() + " -- " + ele.getRemotePort() );
    return ( (ele.getRemoteAddress() == client_socket.getRemoteAddress() && ele.getRemotePort() == client_socket.getRemotePort()) ) 
    })
    if ( index != -1 )
       this.socket_list.splice ( index , 1 )   
    this.socket_map.delete ( client_id );   
    
    console.log ( " index found was " + index );
    console.log ( "length socket_lsit: " + this.socket_list.length )
    console.log ( "length socket_map.size: " + this.socket_map.size )
    
}

socket_server.prototype.run     =    function ( )
{
    process_new_connection_     =    this.process_new_connection.bind ( this )
   // this.server.on ("connection", this.process_new_connection );
    this.server.on ("connection", process_new_connection_ );
   
}

module.exports   =  socket_server
//let sock_serv  =  new socket_server ( '127.0.0.1' , 7777 )