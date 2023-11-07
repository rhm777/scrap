/*
    simplify the worker process for usage.
    i.e. simply provide subclass.
*/


const { workerData , parentPort , isMainThread } = require("worker_threads")

class worker_c
{
    constructor ( exit_immediately = 1 , worker_impl )
    {
        this.exit_immediately = exit_immediately
        this.worker_impl      = worker_impl
    }

    run ( )
    {
        parentPort.postMessage (  {start:workerData, isMainThread} )
        
        parentPort.on("message", async (message)=>
            {
                if ( message === "exit" ){
                    parentPort.close(0);
                    return
                }
                parentPort.postMessage ( "calling implemetation...codes... for " + String(message) )
                let ret_val = await this.worker_impl.process_message ( message )
                console.log ( "****console: " + ret_val )
                //parentPort.postMessage ("done sending to worker..wait for reply.")
                
                /*if ( this.exit_immediately == 1 )
                {
                    parentPort.postMessage ("exiting immediately")
                    parentPort.close()
                }*/
            } );
    }
}
class worker_impl   // impl.
{
    async delay (time) 
    {
        return new Promise (  res => {
          setTimeout(res,time)
        } )
    } 
    async process_message ( message )  // virtual.
    {
        
    }
}
module.exports = { worker_c , worker_impl }




