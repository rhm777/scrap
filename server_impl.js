

let socket_server  =  require ("./socket_server")


// following is needed.
// on_new_connection...when new connection is started. with some socket(client_socket)
// on_data_received ...when socket does activitity.
// on_connection_close...when client_socket closes.
function server_implementation ( host_str , port_int )
{
    this.sock_serv = new socket_server ( host_str , port_int , this );

}

server_implementation.prototype.on_new_connection = function ( client_socket )
{
    console.log ( "[on_new_connection] ----> new connection received from ... " + client_socket.get_id())
  //  client_socket.send_object ( {named:'hello'} );

}
server_implementation.prototype.on_data_received = function ( client_socket , data )
{
    console.log ( " --- data received from "  + client_socket.get_id())
    console.log ( " data : " + data );
    let id = client_socket.get_id();
    let  obj  = {id:id, message:'thankyou'}
    client_socket.send_object (  obj )
    client_socket.close();
    
}
server_implementation.prototype.on_connection_close = function ( client_socket )
{
    console.log ( "[on_connection_close] ----> connection has been closed from socket..." + client_socket.get_id())
}
let serv_impl  =  new server_implementation ( '127.0.0.1', 7777 );
