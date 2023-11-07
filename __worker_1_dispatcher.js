const { type } = require("os");
const { Worker, isMainThread , parentPort } = require ( "worker_threads" )

function create_queue_message ( type , obj )
{
    obj = { "type" : type, "obj":obj }
    return obj
}

const worker = new Worker("./_worker_1.js" );
worker.on("message",(message)=>{
    console.log ( "[main]" + message)
});


let obj_1 = create_queue_message (  "add_to_queue" , {"name":"rah"} )
worker.postMessage ( obj_1 )
setTimeout(  ()=>{
    let obj_2 = create_queue_message (  "add_to_queue" , {"name":"kar"} )
    worker.postMessage ( obj_2 )
},5000)
setTimeout(  ()=>{
    let obj_3 = create_queue_message (  "add_to_queue" , {"name":"sal"} )
    worker.postMessage ( obj_3 )
}, 10000 );
