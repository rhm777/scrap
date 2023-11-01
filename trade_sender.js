// trade_sender sends the reg.object and receives a reply.
// trade_receiver sends the reg.object and receives a reply.

const forwarding_client  =   require ( "./net/forwarding_client")
const trade_t            =   require ( "./trade_t" )
// connect sends and closes.
function trade_sender ( serv_addr , serv_port  )
{
    this.serv_addr = serv_addr
    this.serv_port = serv_port
    this.forwarding_client  =  new forwarding_client ( this.serv_addr, this.serv_port , this )
   // this.forwading_client.connect ()
}

trade_sender.prototype.on_connection_open =  function ( client_socket )
{
    console.log ("[trade_sender] new connection is open..." )
}
trade_sender.prototype.on_data_receive   =  function ( client_socket , obj )
{
    console.log ( "[trade_sender.receive_obj] from " + client_socket.get_id() )
    console.log ( obj.id + "---" + obj.your_name +  " --- " + obj.message);
    //this.forwarding_client.on_data_receive ( client_socket , obj )
}
trade_sender.prototype.send_obj   =  function ( name_ , obj )
{
    this.forwarding_client.send_obj ( "sender", name_ , obj )
    
}
function make_trade ( id , name_ , type , symbol , dir , price , dur_hr , dur_min )
{
    let trd = new trade_t ( id , name_ , type , symbol , dir  )
    trd.set_duration ( dur_hr , dur_min )
    trd.set_price_amount ( price )
    return trd
}

let trade =  make_trade ( 1234 , "macd_1", "opt","gbp/usd", 0, 5.0, 0 , 5 )
//trade.opt_print ()
let trade_sendr   =   new trade_sender ( '127.0.0.1' , 7777 ) 
trade_sendr.send_obj ( "macd_1",trade )
