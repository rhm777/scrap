const Mutex = require ( "async-mutex").Mutex;

async function test ( )
{
    let ts  = Date.now();
    console.log ( "timestamp:" + ts  +  " -- " + new Date(ts).toISOString() )
}

async function get_ui_lock ( )
{
    const m = new Mutex();
    let r   = await m.acquire();
    return r;    
}

async function a (){

    let rel = await get_ui_lock()
    await test();

    rel();
/*let mt = new Mutex();
let release = await mt.acquire();
release();*/
}  // end func a()


