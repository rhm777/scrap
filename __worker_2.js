// todays task.
/* 
    create twtr_pstr_task  which uses task_impl from file: queue_worker.js.
    create class worker_task.  which is defined in worker_2 class. in file queue_worker.
    create class queue_work in queuer_worker.js.


*/

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
function create_queue_message ( type , obj )
{
    obj = { "type" : type, "obj":obj }
    return obj
}
async function delay ( time )
{
    return new Promise (  res => {
        setTimeout(res,time)
      } )
}
busy = 0
parentPort.on ("message" , async (message)=>
        { 
            console.log ( "")
            //console.log ( "*[worker_2]" + JSON.stringify(message) )
            
            if ( message["type"] == "queue_length") // queue_length == process_queue
            {                                       // till_empty.
               let queue_item = message["obj"]
               //console.log ( "[worker_2]: " + JSON.stringify(message["obj"]) );
               let get_queue_item = create_queue_message("get_queue_item",{"name":"g"})
               //console.log ( "[worker_2][posting]:get_queue_item", get_queue_item )
               let queue_length = queue_item["queue_length"]
               
               //console.log ( "[worker_2]: queue length is " + queue_length + " busy:" + busy)
               if ( queue_length>0 && busy == 0 )
               {
                busy = 1
                console.log ( "^^^^^^^^^^^^^^^^^^^^^^Queue is not busy...start processing:" + queue_length);
                parentPort.postMessage ( get_queue_item );
               }
               else{
                console.log ( "^^^^^^^^^^^^^^^^^^^^^^Queue is {Busy|Empty}... not start processing:" + queue_length );
                console.log ( "^^^^^^^^^^^^^^^^^^^^^^missed for " + JSON.stringify(queue_item))
                console.log ( "" )
               }
               
            }
            if ( message["type"] == "queue_item")
            { 
                // consume the complete queue....
                let queue_item = message["obj"]
                await process_queue_item ( queue_item["item"] )
                console.log ( "^^^^^^^^^^^^^^^^^^^^[worker_2] finished one item...")
                busy = 0
                parentPort.postMessage ( create_queue_message("get_queue_length",{name:"none"}))
            }
        });
    async function process_queue_item ( obj )
    {
        console.log ( "^^^^^^^^^^^^^[in item processing]processing queue item...[twtr pstr]: " + JSON.stringify(obj) );
        //require("fs").writeFile()
        await delay ( 10000 )
        console.log ( "^^^^^^^^^^^^^[done in item processing]processing queue item...[twtr pstr]: " + JSON.stringify(obj) );
       
    }