const message_obj = require ("../message_obj") 

// socket is underlying socket. implements generic sending receiving at one place.
// used by server and client.
function socket_wrapper ( socket )
{
    this.socket   =   socket ;

    
}

socket_wrapper.prototype.get_id       =  function ( )
{
    let ret_id  =  this.socket.remoteAddress  + "_" + this.socket.remotePort;
    return ret_id;
}
socket_wrapper.prototype.get_id_from_socket       =  function ( socket )
{
    let ret_id  =  socket.remoteAddress  + "_" + socket.remotePort;
    return ret_id;
}
// all send receive are wrapped in the object, due to json.parse requirement
// for sending. all objects are created using message_obj as [key] = val
socket_wrapper.prototype.send_object  =  function ( obj  )
{
    this.socket.write ( JSON.stringify ( obj ) )
}

socket_wrapper.prototype.receive_object = function ( json_str )
{
     let msg_obj = JSON.parse ( json_str )
    // console.log ( msg_obj.message )
     return msg_obj //.message
}

socket_wrapper.prototype.getRemotePort = function ( )
{
    return this.socket.remotePort
}
socket_wrapper.prototype.getRemoteAddress = function ( )
{
    return this.socket.remoteAddress
}

socket_wrapper.prototype.close    =   function ()
{
    this.socket.destroy();
    this.socket.emit("end");
}
socket_wrapper.prototype.print   =   function ( )
{
    console.log ( "socket_id: " + this.get_id ( ) );
}

module.exports = socket_wrapper