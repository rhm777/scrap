const { type } = require("os");
const { worker_queue_dispatcher }  = require("./queue_worker_singleton.js")
let wqd = new worker_queue_dispatcher ("./twtr_pstr_queue_worker_singleton.js") 
messages = [
    {"title":"twitter post test_0","content":"this is a test content_0..."},
    {"title":"twitter post test_1","content":"this is a test content_1..."},
    {"title":"twitter post test_2","content":"this is a test content_2..."},
    {"title":"twitter post test_3","content":"this is a test content_3..."}
   ]
//wqd.dispatch_message ( messages[2] )
//wqd.dispatch_message ( messages[3] )

class worker_queue_dispatcher
{
    constructor ()
    {
        if ( this.wqd == undefined )
            this.wqd = new worker_queue_dispatcher ("./twtr_pstr_queue_worker_singleton.js") 
    }
    dispatch_message ( message )   // message format is for twitter.
    {
        this.wqd.dispatch_message ( message )
    }
}

//let w_q_d = new worker_queue_dispatcher()
//w_q_d.dispatch_message ( message[0] )















//wqd.dispatch_message ( messages[2] )
//wqd.dispatch_message ( messages[3] )


//wqd.dispatch_message ( messages[1] )



/*
setTimeout(  ()=>{
    wqd.dispatch_message ( {"name":"kar"} )
} , 5000 )

setTimeout(  ()=>{
    wqd.dispatch_message ( {"name":"sal"} )
} , 9000 )*/
