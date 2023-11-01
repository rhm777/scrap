// trade_sender sends the reg.object and receives a reply.
// trade_receiver sends the reg.object and receives a reply.

const forwarding_client  =   require ( "./net/forwarding_client")
const trade_t            =   require ( "./trade_t" )
// connect sends and closes.
function trade_receiver ( serv_addr , serv_port , name_ , trade_receiver_impl )
{
    this.serv_addr = serv_addr
    this.serv_port = serv_port
    this.name      = name_
    this.forwarding_client  =  new forwarding_client ( this.serv_addr, this.serv_port , this )
    this.trade_receiver_impl  =  trade_receiver_impl
}

trade_receiver.prototype.on_connection_open =  function ( client_socket )
{
    console.log ("[trade_receiver] new connection is open..." )
}
trade_receiver.prototype.on_data_receive   =  function ( client_socket , obj )
{
    console.log ( "[trade_receiver.receive_obj] from " + client_socket.get_id() )
    if ( obj.your_name )
        console.log ( obj.id + "---" + obj.your_name + " --- " + obj.message );
   // else
   //     console.log ( obj )
    this.trade_receiver_impl.on_data_receive ( client_socket , obj )
    // data is returned to the platform.
}
// use this for sending it prepends the require fields.
trade_receiver.prototype.send_obj   =  function ( obj )
{   // this will register on the server for the name_ strategy. but not other. 
    this.forwarding_client.send_obj ( "receiver", this.name_ , obj )
}
trade_receiver.prototype.register  = function (  )
{
    this.forwarding_client.send_obj ( "receiver", this.name , {} )
}
module.exports = trade_receiver
//let trade_recvr   =   new trade_receiver ( '127.0.0.1' , 7777 ) 
//let trade         =   new trade_t ( 12345 , "opt", "macd_strategy_2")
//let message = {}
//trade_recvr.send_obj ( "macd_strategy_2", message )

