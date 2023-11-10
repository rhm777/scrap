const { json } = require("express")
let { socket_client  , socket_connection }  = require ("./socket_client.js")
//let { socket_server , socket_connection } = require("./socket_server_1");

class mql5_client extends socket_connection
{
    constructor ( socket )
    {
        super ( socket )
    }
    static get_instance ( socket )
    {
        return new mql5_client ( socket )
    }

    on_data ( data )
    {
        //console.log ( "[mql5_client] received data..." + data )
        let d = String(data)
        let command = this.extract_seq_str ( d )
        console.log ( "command: " + command + "---" + d )
        if ( command == "message_post_tweet" )
        {
            console.log ( d )
            let obj = this.get_object_from_str ( "message_post_tweet" , d )
            let message = obj["message"]
            console.log ( "" )
            console.log ( message )
            //console.log ( message["message_str"] )
            //console.log ( message["id"] )
            console.log ( "\r\nclosing connection now. for " + message?.id)
            this.close()
            
        }
        if ( command == "initial_message" )
        {
            console.log ( d )
            console.log ( "" )
            //let obj = {}
            //obj["message"] = {"title":"this is a test title_5","content":"this is a test content_5" , "ide":"12345"} 
            //let str = "[post_tweet]" + JSON.stringify (obj)
            //console.log ( str )
            //this.send_msg ( str )
            
            //this.send_msg ("[message_1][socket_client] client received the message...." )
            //this.send_msg ("[query_time][socket_client] what time is it....." )
        }
        //if ( command == "query_time_answer" )
        //{ console.log ( d ) }
       
    }
    on_close ( )
    {
        console.log ( "[mql5_client] received close...")
    }
    send_msg ( message )
    {
        console.log ( message )
        let message_str = "[post_tweet]" + JSON.stringify ( message )
        super.send_msg ( message_str )
        //console.log ( str )
        //throw new Error("g")
        //this.socket_connection.send_msg ( message )
    }
}  
let message    =  { "title":"this is a title_6", "content":"this is test content_6","id":"6"}
let message_0  =  { "title":"this is a title_7", "content":"this is test content_7","id":"7"}
let message_1  =  { "title":"this is a title_8", "content":"this is test content_8","id":"8"}

function send_msg (mess)
{
    var s_c      =  new socket_client ( "127.0.0.1", 3001 , mql5_client )
    s_c.start ()
    s_c.send_msg ( { "message":mess } )
}
send_msg ( message   )
send_msg ( message_0 )
send_msg ( message_1 )

//s_c.close()
//s_c_0      =  new socket_client ( "127.0.0.1", 3001 , mql5_client )
//s_c_0.start ()
//s_c_0.send_msg ( { "message":message_0 } )
//s_c.close()
//s_c_1      =  new socket_client ( "127.0.0.1", 3001 , mql5_client )
//s_c_1.start ()
//s_c_1.send_msg ( { "message":message_1 } )
//s_c.close()

//s_c.close()
//s_c.send_msg ( { "message":message_0 } )
//s_c.send_msg ( { "message":message_1 } )


/*
setTimeout(() => {
    s_c.send_msg ( { "message":message_0 } )
}, 8000);

setTimeout(() => {
    s_c.send_msg ( { "message":message_1 } )
}, 8000);
*/
/*
s_c.send_msg ( { "message":message } )
setTimeout(() => {
    
}, 8000);
*/



//var s_c_1      =  new socket_client ( "127.0.0.1", 3001 , mql5_client )
//s_c_1.start ()
//s_c_1.send_msg ( { "message":message_0 } )

//var s_c_2      =  new socket_client ( "127.0.0.1", 3001 , mql5_client )
//s_c_2.start ()
//s_c_2.send_msg ( { "message":message_1 } )

//var s_c_2      =  new socket_client ( "127.0.0.1", 3001 , mql5_client )
//s_c_2.start ()
//s_c_2.send_msg ( { "message":message_1 } )

//var s_c_0      =  new socket_client ( "127.0.0.1", 3001 , mql5_client )
//s_c_0.start ()
//s_c_0.send_msg ( { "message":message_0 } )
