// todays task: 
// *class for twitter posting with don't post = true. 2 hours.
// *send message from the dispatcher to it.   30 mins.
// intergrate it in networking socket server. 1 hr.
// send message from network client.    1 hr.
// send message from python.            1 hr.
// 5 hrs.  till 4.30 p.m.
// take rest.


// this is a framework for dispatching messages to queue_worker , which
// calls the user provided worker_thread_singleton implementation.
// all message run one at a time by worker_thread_singleton.
// queue_worker_singleton is a usable component it works with usable
// worker_thread_singleton. 
// worker_thread_singleton get as input subclass of worker_thread_handler.
// which is a unit of work.e.g. twtr_pstr_worker_thread_handler is an argument to
// worker_thread_singleton.
// see: twtr_pstr_queue_worker.js / twtr_pstr_worker_thread_handler /
// queue_worker_dispatcher ---> twtr_pstr_queue_worker_singleton_dispatcher.
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

class queue_worker_singleton
{

    constructor ( worker_thread_handler_file )
    {   // we need some implementation for subclassing. but not used at all.
        this.queue = []
        this.worker_thread_hander_file = worker_thread_handler_file
    }

    create_queue_message ( type , obj )
    {
        obj = { "type" : type, "obj":obj }
        return obj
    }
    
    async run ()
    {
        // received messages from lower layer.
        let worker2 = new Worker ( this.worker_thread_hander_file )
        worker2.on ( "message",  (message)  => 
            {   
                if ( message["type"]  == "get_queue_item")
                {   // query for the length of the queue....before asking for obj. 
                    let obj_to_send = this.create_queue_message("queue_item" ,{ "item":this.queue.shift(),"queue_length":(this.queue.length)}) 
                    worker2.postMessage ( obj_to_send ) 
                }
                else if ( message["type"]  == "get_queue_length")
                {
                    let obj_to_send = this.create_queue_message("queue_length", {"queue_length":this.queue.length})
                    worker2.postMessage ( obj_to_send )
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
                    this.queue.push ( message["obj"] )
                    worker2.postMessage ( this.create_queue_message("queue_length", {"queue_length":this.queue.length}) )
                }
        });
    }
}

class worker_thread_singleton
{
    constructor ( worker_thread_handler_impl )
    {
        this.worker_thread_handler_impl = worker_thread_handler_impl
    }
    create_queue_message ( type , obj )
    {
        obj = { "type" : type, "obj":obj }
        return obj
    }
    async delay ( time )
    {
        return new Promise (  res => {
            setTimeout(res,time)
          } )
    }
    async run ()
    {
        let busy = 0
        if ( this.worker_thread_handler_ins == undefined )
        {
            this.worker_thread_handler_ins = this.worker_thread_handler_impl.get_instance()
            console.log ("######################### workerthreadhandler...")
        }
        parentPort.on ("message" , async (message)=>
        { 
            console.log ( "")
            //console.log ( "*[worker_2]" + JSON.stringify(message) )
            
            if ( message["type"] == "queue_length") // queue_length == process_queue
            {                                       // till_empty.
               let queue_item = message["obj"]
               //console.log ( "[worker_2]: " + JSON.stringify(message["obj"]) );
               let get_queue_item = this.create_queue_message("get_queue_item",{"name":"g"})
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
            else if ( message["type"] == "queue_item")
            { 
                // consume the complete queue....
                let queue_item = message["obj"]
                //await this.process_queue_item ( queue_item["item"] )
                await this.worker_thread_handler_ins.process_queue_item ( queue_item["item"])
                console.log ( "^^^^^^^^^^^^^^^^^^^^[worker_2] finished one item...")
                busy = 0
                parentPort.postMessage ( this.create_queue_message("get_queue_length",{name:"none"}))
            }
            this.worker_thread_handler_ins.on_message ( message )
        });
    }
    
}
class worker_thread_handler 
{
    async delay ( time )
    {
        return new Promise (  res => {
            setTimeout(res,time)
          } )
    }
    on_message ( obj )
    {
        console.log ( "@@@@@@@@@@@@@@@@@@@@@" + JSON.stringify(obj))
    }
    send_message ( obj )
    {
        parentPort.postMessage ( obj )
    }
    async process_queue_item ( obj )
    {
       
    }
}



class worker_queue_dispatcher
{
    constructor ( queue_worker_file )
    {
        this.queue_worker_file   =  queue_worker_file
        this.worker_queue        =  new Worker ( queue_worker_file )
    }

    create_queue_message ( type , obj )
    {
        obj = { "type" : type, "obj":obj }
        return obj
    }
    
    dispatch_message (  message )
    {
        let obj_1 = this.create_queue_message (  "add_to_queue" , message )
        this.worker_queue.postMessage ( obj_1 )
    }
}

module.exports = { worker_queue_dispatcher, queue_worker_singleton , worker_thread_singleton, worker_thread_handler }
// now convert worker 1 to class implementation in _worker_1.js