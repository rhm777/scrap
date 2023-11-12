const { type } = require("os");
const { worker_queue_dispatcher }  = require("./queue_worker_singleton.js")
messages = [
    {"title":"twitter post test_0","content":"this is a test content_0..."},
    {"title":"twitter post test_1","content":"this is a test content_1..."},
    {"title":"twitter post test_2","content":"this is a test content_2..."},
    {"title":"twitter post test_3","content":"this is a test content_3..."}
   ]

class twtr_pstr_queue_worker_dispatcher
{
    constructor ()
    {
        if ( this.wqd == undefined )
            this.wqd = new worker_queue_dispatcher ("./twtr_pstr_queue_worker_singleton.js") 
    }
    dispatch_message ( message )   // message format is for twitter.
    {
        console.log ("[twtr_pstr_que_worker_disp...]XXXXXXXXXXXXXXXXXXXXXXXXXXXXXdispatching message:"+JSON.stringify(message))
        this.wqd.dispatch_message ( message )
    }
}

let w_q_d = new twtr_pstr_queue_worker_dispatcher()
//w_q_d.dispatch_message ( messages[0] )
//w_q_d.dispatch_message ( messages[1] )
//w_q_d.dispatch_message ( messages[2] )
//w_q_d.dispatch_message ( messages[3] )
var net = require("net")

var server = net.createServer(function(stream) {
    stream.on('data', function(c) {
      //console.log('data:', c.toString());
        obj = JSON.parse( c )
        console.log ( obj["content"])
        w_q_d.dispatch_message ( obj )
    });
    stream.on('end', function() {
     // server.close();
    });
  });

const pipePath = '\\\\.\\pipe\\my_pipe';
server.listen ( pipePath )
//server.listen('/tmp/test.sock');


//module.exports = { twtr_pstr_queue_worker_dispatcher }













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
