


var {socket_server, socket_connection} = require("./socket_server_1.js")
const { twtr_pstr } = require("./twtr_pstr.js")
//const { twtr_pstr_queue_worker_dispatcher } = require("./twtr_pstr_queue_worker_dispatcher.js")

class mql5_twtr_server_conn extends socket_connection
{
    constructor ( socket )
    {
        super ( socket )
       // this.q_w_d = new twtr_pstr_queue_worker_dispatcher()
       // console.log ( "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX>>>this.qwd_init")
            
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
        else if ( command == "post_tweet" )
        {
            //console.log ( d );
            let obj = this.get_object_from_str ( "post_tweet" , d )
            let message = obj["message"]
            
            console.log ("message for post_tweet...")
            console.log ( message )
            console.log ("---------------------------> dispatching above message...")
           // throw new Error("xyz")
            console.log ("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX message: " + JSON.stringify(message) )
            //this.q_w_d.dispatch_message ( message )
            // here add socket forwarding to twitter. dispatcher.
            
            var stream = require("net").connect('/tmp/test.sock');
            //obj = {"title":"twitter post test_5","content":"this is a test content_5..."}
            //obj_str = JSON.stringify ( obj )
            stream.write ( JSON.stringify(message) );
            stream.end();

           // await this.delay(18000)
            console.log ( "---------------------------------->delay over...")
            obj = {};  
            obj["message"] = {"message_str":"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@request piped...post tweet submitted with id=", "id":message["id"]}
            this.send_msg ( "[message_post_tweet]" + JSON.stringify(obj) )
        }    
    }

    on_close ( )
    {
        console.log ( "[mql5_server] received close...")
    }
    /*senda_msg ( msg )
    {
        console.log ( "[mql5_server] send_msg ... ")
        super.send_msg ( msg )
    }*/
}
// this implements protocol for receiving data.
// for now we only interesting is sending message object.
// then used the dispatcher here to send the data to the twtr brower---
// ---- before the browser area.
// how , implement the singleton class. in constructor. then used it to 
// send the messsage.
sock_conn  =  new mql5_twtr_server_conn();
let s_s    =  new socket_server ( "localhost", 3001, 100 , mql5_twtr_server_conn )
s_s.start( )

//on_data_handler = sock_handler.on_data.bind(socket_handler)

//console.log ( "helo")
