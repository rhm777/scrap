
const message_obj = require("../message_obj")
const socket_client  =   require ( "./socket_client")
const trade_t        =   require ( "../trade_t" )
// connect sends and closes.
function forwarding_sender ( serv_addr , serv_port , client_impl )
{
    this.serv_addr = serv_addr
    this.serv_port = serv_port
    this.client_impl = client_impl
    this.socket_client  =  new socket_client ( this.serv_addr, this.serv_port , this )
    this.socket_client.connect ()
    
}
// call back by socket_client.
forwarding_sender.prototype.on_connection_open =  function ( client_socket )
{
   // let trade_obj = new trade_t ( 12345, "opt" , "macd_strategy_1_a")
   // client_socket.send_object ( trade_obj , "sender" , "" )
   // this.client_impl.on_connection_open ( client_socket )
}
forwarding_sender.prototype.on_data_receive = function ( data )
{
    this.client_impl.on_data_receive ( data )
}
forwarding_sender.prototype.send_obj  =  function ( dir , name_ , obj )
{
    let msg_obj  =  new message_obj()
    let msg      =  msg_obj.new_empty_object()
    msg ["dir"] = dir ;  msg["name"] = name_ ;  msg["obj"] = obj;
    this.socket_client.send_obj ( msg ) 
}
let trade_sendr   =   new forwarding_sender ( '127.0.0.1' , 7777 ) 
let trade         =   new trade_t ( 12345 , "opt" )
trade_sendr.send_obj ( "sender", "macd_strategy_2", trade )
//trade_sendr.send_obj ( "sender", "macd_strategy_1", trade )
