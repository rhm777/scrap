/* here this is also a worker and dispatches to the worker. */
// but distinguishes between mainthread and thread.
const { Worker,workerData , parentPort , isMainThread } = require("worker_threads")

function long_running_function(input)
{
    let j = 0;
    for ( let a = 0; a < 30000000*input; a++ )
    {
        j++
    }
    return j;
}
if ( isMainThread )
{   // let this run 
    
    /*
    let arr = [10, 60,80,90,20,33]
    for ( let a in arr )
    {
        console.log ( "dispatching for a:" + a + "---val: " + arr[a])
        let worker = new Worker ( __filename , {workerData:arr[a]});
        return new Promise ( async ( resolve ) =>
            worker.on ( "message" , (msg) => { console.log ( msg );resolve()  })
        )
    }*/
    
    
}
else
{
    console.log ( "wokrer data: " , workerData )
    val = long_running_function ( workerData )
    parentPort.postMessage ( "worker finished... for " + workerData+ "--val:" + val)
}
