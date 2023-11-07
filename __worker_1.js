const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
function create_queue_message ( type , obj )
{
    obj = { "type" : type, "obj":obj }
    return obj
}

let queue = []

if ( isMainThread )
{
    console.log ( "you are in main thread... " )
  
}
else{
    // received messages from lower layer.
    let worker2 = new Worker ( "./_worker_2.js" )
    worker2.on ( "message",  (message)  => 
            {   
                if ( message["type"]  == "get_queue_item")
                {   // query for the length of the queue....before asking for obj. 
                    let obj_to_send = create_queue_message("queue_item" ,{ "item":queue.shift(),"queue_length":(queue.length)}) 
                    worker2.postMessage ( obj_to_send ) 
                }
                else if ( message["type"]  == "get_queue_length")
                {
                    worker2.postMessage ( create_queue_message("queue_length", {"queue_length":queue.length}) )
                }
            });
    // received message for upper layer.        
    parentPort.on ("message" , (message)=>
        { 
            console.log ("")
            if ( message["type"] == "add_to_queue")
            {   // here.seems no..race condition: missed if busy=1.
                // if missed then it queuries.
                // when queried it is 0. busy = 0 also. but if something is 
                // posted immediately then queue_length is posted also.
                // it can then be missed due to busy=1 as above.but subsequent
                // query will succeed. thus no race condition.
                queue.push ( message["obj"] )
                worker2.postMessage ( create_queue_message("queue_length", {"queue_length":queue.length}) )
            }
        });
}
