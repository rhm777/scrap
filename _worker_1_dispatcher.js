const { type } = require("os");

const { worker_queue_dispatcher }  = require("./queue_worker_singleton.js")


let wqd = new worker_queue_dispatcher ("./_worker_1.js")
wqd.dispatch_message ( {"name":"rah"} )
setTimeout(  ()=>{
    wqd.dispatch_message ( {"name":"kar"} )
} , 5000 )

setTimeout(  ()=>{
    wqd.dispatch_message ( {"name":"sal"} )
} , 9000 )
