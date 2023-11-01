const socket_client  =  require ( "./socket_client")
// make use of socket_client. 
function client_impl ( serv_addr , serv_host )
{
    this.client  =  new socket_client ( serv_addr , serv_host, this )
    this.client.connect();
    this.key = "name"
}
client_impl.prototype.on_connection_open = function ( client_socket )
{
    console.log ( " impl is now connected ... with " )
    this.client.send_obj ( {usage:'not defined'})
    //console.log ( client_socket )
}
client_impl.prototype.on_connection_close = function ( client_socket )
{
    console.log ( " impl is now close ...  " )
    //console.log ( client_socket )
}
client_impl.prototype.on_data_received    =  function ( obj )
{
    console.log ( "[client_impl] obj received:")
    console.log ( obj )
    if ( obj.named )
        this.client.send_obj ( {names:'helo,balo,selo'})
    else{
        console.log ( obj.id + "," + obj.message )    
      //  this.client.close();
    }
}
let client_imp  =  new client_impl ( '127.0.0.1', 7777 )
