/*
    change implementation as follows:
    socket server gets name of sub class which implements
    get_inst()
    new stuff are
    how to with the accept create a queue instead of thread.
*/

var {socket_server, socket_connection} = require("./socket_server_1.js")

class mql5_twtr_server_conn extends socket_connection
{
    constructor ( socket )
    {
        super ( socket )
    }
    
    static get_instance ( socket )
    {
        return new mql5_twtr_server_conn ( socket )
    }
    async delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      } 
    async on_data ( data )
    {
        console.log ( "[mql5_server] received data..." + typeof(data) + " -- " + data )
        let d = String(data)
        let command = this.extract_seq_str ( d )
        console.log ( "command: " + command )
        if ( command == "query_time" )
        {
            let date_ob = new Date()
            this.send_msg ( "[query_time_answer][server] time: " + String(date_ob) )
        }
        else if ( command == "object" )
        {
            let obj = this.get_object_from_str ( d )
            console.log ( obj["key_1"] )
            await this.delay(20000)
            console.log ( "delay over...")
            this.send_msg ( "[message_1] object received.Thankyou.")
        }    
    }

    on_close ( )
    {
        console.log ( "[mql5_server] received close...")
    }
    senda_msg ( msg )
    {
        console.log ( "[mql5_server] send_msg ... ")
        super.send_msg ( msg )
    }
}

sock_conn  =  new mql5_twtr_server_conn();
let s_s    =  new socket_server ( "localhost", 3001, 100 , mql5_twtr_server_conn )

//on_data_handler = sock_handler.on_data.bind(socket_handler)
s_s.start( )

//console.log ( "helo")
