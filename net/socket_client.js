
// provides class to connect/disconnect with the server.
const { SSL_OP_LEGACY_SERVER_CONNECT } = require("constants");
const net             =  require ( "net" );
const message_obj = require("../message_obj");
const socket_wrapper  =  require ("./socket_wrapper")

function  socket_client ( serv_addr  ,  serv_port , client_impl )
{
    this.serv_addr     =   serv_addr;
    this.serv_port     =   serv_port;
    this.client_socket_ =   new net.Socket();
    this.client_impl    =  client_impl;
    
    
}

socket_client.prototype.print    =  function ()
{
    console.log ( "serv_addr: " + this.serv_addr + " --- port: " + this.serv_port )
}

socket_client.prototype.connect  =  function ()
{
    try{
    this.client_socket_.connect ( {port:this.serv_port, host:this.serv_host} );
    console.log ( " connected with server " + this.serv_addr + " port:" + this.serv_port );
    this.client_socket  = new socket_wrapper ( this.client_socket_   )
    this.client_socket_.par_this  =  this
    this.client_socket_.on ( "data"  , this.on_connection_data       )
    this.client_socket_.on ( "end"   , this.on_connection_close      )
    this.client_socket_.on ( "error" , this.on_connection_error      )
    }catch ( err )
    {
        console.log ( err )
        return 
        //console.log ( "***[client_socket err]: " + err.name )
    }
    this.client_impl.on_connection_open ( this.client_socket )
}
socket_client.prototype.on_connection_error = function  ( err )
{
    console.log ( " error occured.... " + err.message )
    //throw new Error ( err )
} 
socket_client.prototype.on_connection_close = function  (  )
{
    let this_ = this.par_this
    console.log ( " client connection has been close with id: " + this.remotePort )
   // this_.client_impl.on_connection_close ( this_.socket_client  )
    //this_.client_socket.print()
    //this_.print()
}
socket_client.prototype.on_connection_data = function  ( data )
{
    let this_  = this.par_this
   // console.log ( "receive from server... " )
   // console.log ( data.toString() )
    // let obj = this_.client_socket.receive_object ( data )
    this_.client_impl.on_data_receive ( this_.client_socket , JSON.parse(data) );
   // console.log ( obj.name_ )
}

socket_client.prototype.disconnect = function ()   // called manually.
{
    let this_ = this.par_this
    this_.client_impl.on_connection_close ( this )   // send socket information before clsng.
    this.client_socket.close()   // close socket manually.
}
// implementation use this.
socket_client.prototype.send_obj  =  function ( obj )
{
    this.client_socket.send_object ( obj )
}



socket_client.prototype.close       = function ()
{
    this.client_socket.close();
}
module.exports = socket_client

//let client = new socket_client ( "127.0.0.1", 7777 )
//client.connect();

//let r = { a : 'c'}
//let obj = new message_obj().new_object("a", "c" ); 
//console.log ( obj );

//client.print();


