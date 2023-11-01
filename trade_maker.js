

const forwarding_client  =  require ( "./forwarding_client" )

// impl. using forwarding_client. to send trade_object.
// trade_forwarding_server.

function trade_maker (  serv_addr , serv_port )
{
    this.serv_addr   =  serv_addr
    this.serv_port   =  serv_port
    this.forwarding_client  =   new forwarding_client ( this.serv_addr , this.serv_port , this )

}

trade_maker.prototype.on_connection_open = function ( client_socket )
{

} 

trade_maker.prototype.on_data_receive = function ( client_socket , data )
{

}
