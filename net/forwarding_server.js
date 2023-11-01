/*  may 17-18:  ui-trade execution.
    may 19-21:  reporting and logging etc.
*/
// completed , trade_forwarding{server,sender,receiver}
// now run trade forwarder in some window.
// fix trade sender. for trade and print trade at forwarder server.
// this trade is received at platform which forwards it to the
// opt_pltfrm implemented opt_olymp_impl.


const socket_server  =  require ( "../socket_server" )

function forwarding_server ( host_addr , host_port , forwarding_impl )
{
    this.socket_server    =   new socket_server ( host_addr , host_port , this )
    this.forwarding_impl  =   forwarding_impl
    
    this.socket_id_map            =   new Map()
    this.socket_name_map          =   new Map()
    
}
// on_new_connection does nothing. since incoming packet has to 
// evaluate for established connection if not exists. and removing
// connection when completed. 
forwarding_server.prototype.on_new_connection =  function ( client_socket )
{
    console.log ( "[forwarding_server] on_new_connection has been called..." + client_socket.get_id() )
    // add if this socket does not exists.
    // save this in cntx map.
    //this.name_map.delete ( client_socket.get_id() )
    //this.name_map.set    ( client_socket.get_id() , client_socket )
    this.forwarding_impl.on_new_connection ( client_socket )
}

forwarding_server.prototype.remove_connection  = function ( client_socket )
{
    // remove from id_list as well as name_list.

    let client_id   =  client_socket.get_id()
    let id_rec = this.socket_id_map.get ( client_id )
    console.log ( "[forwarding_server.remove_connection] length:" + this.socket_id_map.size + " --- " + this.socket_name_map.size )
    if ( id_rec )
    {
        this.socket_id_map.delete ( client_id )
        let    arr = this.socket_name_map.get ( id_rec [1] )   
        console.log ( "---- for name: " + id_rec[1] + " --- length: " + arr.length )
        let  index  =  arr.findIndex ( (ele) => {
            //console.log ( ele.get_id() ) 
            //console.log ( client_id )
            return ( (ele.get_id() == client_id) ) 
         })
        if ( index != -1 )
            arr.splice ( index , 1 ) 
        if ( arr.length == 0 )
            this.socket_name_map.delete ( id_rec[1] )
        console.log ( "----["+index + "] for name: " + id_rec[1] + " --- length: " + arr.length )
    }
    console.log ( "[forwarding_server.remove_connection] length:" + this.socket_id_map.size  + " --- " + this.socket_name_map.size )
    
}
// obtains the object with dir and passes to the impl.
// forward the message to the implementation.
forwarding_server.prototype.on_data_received    =  function  ( client_socket , msg )
{
    console.log ( "[forwarding_server] data receive ... " )
    let dir   = msg["dir"]
    let name_ = msg["name"]
    let obj   = msg["obj"]
    console.log ( dir   )  
    console.log ( name_ )
    console.log ( msg )
    let client_id  =  client_socket.get_id()
    //console.log ("-------------------------->client_id: " + client_id )
    let id_obj = this.socket_id_map.get(client_id) 
    if ( dir == "receiver"  )  // new receivers are added.
    {    // add receiver to the list.
        if ( !id_obj ) { // receiver is new .
        id_obj = [client_id,name_]
        console.log ( " reciver is new ")
        console.log ( id_obj )
        this.socket_id_map.set ( client_id , id_obj  )
        let arr = this.socket_name_map.get ( name_ )
        if ( !arr  ) { 
            arr = new Array();   // init. array.
            this.socket_name_map.set (name_, arr )
        }
        arr.push ( client_socket )
        //console.log ( "name_array for " + name_ + " length is " + arr.length + " --- name_map:" + this.socket_name_map.size )
        }
        this.forwarding_impl.on_data_received ( client_socket , msg )
        for ( [key,val] of this.socket_name_map )
        {
            console.log ( key + " ------------- "  )
            console.log ( "length of arr for above key " + val.length )
        }
    }
    if ( dir == "sender" ) {
        console.log ( "[forwarding_server.on_data_receive] from sender ... ")
        //console.log ( id_obj[0] + " --- " + id_obj[1] )
        // forward this message to all receivers with matching name.
        this.forwarding_impl.on_data_received ( client_socket , msg )
    } 
}

forwarding_server.prototype.forward_obj =   function ( name_ , obj )
{
    // forward objects to this name.
    let arr = this.socket_name_map.get ( name_ )
    console.log ( "[forwarding_server.forward_obj] to name:" + name_ )
    if ( arr == undefined )
    {
        console.log ( "[forwarding_server.forward_obj] there are no receivers yet.")
        console.log ( obj )
        return 0
    }
    if ( arr != undefined )
    {
        console.log ( " lengtharr:" + arr.length)
        if ( arr  ) { 
            for ( let i = 0; i < arr.length; i++ )
            {
                client_socket = arr[i];
                client_socket.send_object ( obj )
            }
        }
        return arr.length
    }
    return 0
}

forwarding_server.prototype.send_obj =   function ( obj )
{
    

}

forwarding_server.prototype.print    =   function ( )
{
    console.log ( " [forwarding_server.print] id_list:" + this.socket_id_map.size )
    console.log ( "----------------------> map.size: "  + this.socket_name_map.size )
    
}
forwarding_server.prototype.on_connection_close  =  function  ( client_socket )
{
    console.log ( "[forwarding_server on_conn_close has been called..." + client_socket.get_id() )
    // this.forwarding_impl.on_connection_close ( client_socket )
    this.remove_connection ( client_socket )
}

module.exports = forwarding_server
//let f_serv  =  new forwarding_server ( '127.0.0.1', 7777 )