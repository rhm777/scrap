const { workerData , parentPort , isMainThread } = require("worker_threads")

/*
let j   =  0;
for ( let a = 0; a < 60000000; a++ )
{
    j++;
    //console.log ( j )
}
parentPort.postMessage ( j*2 )
*/
queue = []
parentPort.on("message", (message)=>
{
    if ( message === "exit" ){
        parentPort.postMessage("sold");
        parentPort.close(0);
    }
    else if ( message === "pop" )
    {
        if ( queue.length > 0 ){
            data = queue.shift()
            parentPort.postMessage ( "poped: " + data )
        }
        else{
            parentPort.postMessage ("done")
        }
    }
    else{
        queue.push ( message )
        parentPort.postMessage("[from client] added to queue:" + queue.length );
        
    }

});
parentPort.postMessage (  {start:workerData, isMainThread} )
