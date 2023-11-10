// todays task.
/* 
nov 10:
completed the execution logic of network server.
following is needed.
consider a post is created .... 
then fields are attacted. then image_cnt along with
file_names full path are attached.
this is sended to by socket_client to network server in nodejs.
now need to put code to send this file. along with saved names
for the server. 
saved file names would be a base name.
so first read the code to transfer file.
then transfer messages with protocol to the folder.

*/

const { worker_thread_singleton , worker_thread_handler }  = require("./queue_worker_singleton.js");
const { twtr_pstr } = require("./twtr_pstr.js");

// then move it to different file the class_def.
// and then import it and provide implementations.
class worker_thread_handler_twtr_pstr extends worker_thread_handler 
{
    static get_instance ( )
    {
        let ins = new worker_thread_handler_twtr_pstr()
        return ins
    }
    
    
    async process_queue_item ( obj )
    {   // this async process will run.
        // object here is an actual message.
        // first only print the message for testing.
        let message = obj
        console.log ( "^^^^^^^^^^^^^[in item processing]processing queue item...[twtr pstr]: " + JSON.stringify(obj) );
        //require("fs").writeFile()
        console.log( "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX>>>>message: " + JSON.stringify(message) )
        if ( this.twtr_pstr_ == undefined ){
            console.log( "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX>>>>UNDEFINED "  )
            this.twtr_pstr_ = new twtr_pstr(true,1);
            await this.twtr_pstr_.load_page (base_url)
        }
        await this.twtr_pstr_.run ( message )
        //await this.delay ( 10000 )
        //await this.twtr_pstr_.pup_base.browser.close()
        
        console.log ( "^^^^^^^^^^^^^[done in item processing]processing queue item...[twtr pstr]: " + JSON.stringify(obj) );
    }
}
new worker_thread_singleton ( worker_thread_handler_twtr_pstr ).run()
