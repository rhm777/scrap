
const forwarding_server  =   require ("./net/forwarding_server")

function trade_forwarding_server  ( serv_addr , serv_post )
{
    this.serv_addr   =   serv_addr
    this.serv_post   =   serv_post
    this.forwarding_server   =   new forwarding_server ( this.serv_addr , this.serv_post , this )

}

trade_forwarding_server.prototype.on_new_connection = function ( client_connection )
{
    console.log ( "[trade_forwarding_server.on_new_connection] from " + client_connection.get_id())
}
/*
trade_forwarding_server.prototype.send_obj          =   function ( data )
{
    this.forwarding_server.send_obj ( data )
}*/
trade_forwarding_server.prototype.on_data_received  =   function ( client_connection , data )
{
    console.log ( "[trade_forwarding_server.on_data_receive]" + client_connection.get_id() )
    let  dir  =  data ["dir"]; let name_ = data["name"];
    let trade =  data ["obj"]
    console.log ( dir + " --- " + name_ + " --- " + trade.id + " --- " + trade.ui_id )
    if ( dir == "sender" ) {  // reply to sender.
        let obj = {id:77777,your_name: name_, message:"thankyou, I am sending..."}
        client_connection.send_object ( obj )
        client_connection.close()
        this.forwarding_server.forward_obj ( name_ , trade )
    }
    else if ( dir == "receiver" )
    {   // reply to receiver but don't close. receiver has info object.[your_name]
        let obj = {id:77777, your_name:name_,message:"thankyou, you are registered now."}
        client_connection.send_object ( obj )
    }
    this.forwarding_server.print()
   
}

let trade_forwarding_server_ = new trade_forwarding_server ( '127.0.0.1', 7777 )


