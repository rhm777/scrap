const Mutex  =   require ( "async-mutex").Mutex;


const mutex  =  new Mutex();
function sleep ( ms )
{
    return new Promise ( (resolve,err)=>
        setTimeout ( resolve, ms )
    )
    
}
sleep(10000).then ( ()=>console.log("completed"));
async function r (){
await sleep ( 7000 );
console.log ( "comp");
}
console.log ( "calling r ");
r();
setTimeout ( async ()=>{
    while ( true ) {
    let rel = await mutex.acquire ();
    console.log ( " -------------------->proc A has acquire lock ... " );
    let loc = "";
    while ( true )
    {
       await sleep ( 1000 );
       loc = loc + "a"; 
       console.log ( "a" + " --- " + loc.length );
       if ( loc.length > 40 )
       {
            rel();
            console.log ( " -------------------->proc A is giving up lock ... " );
            break;
       }
    }
    }
},2000)
setTimeout ( async ()=>{
    while ( true ) {
    let rel = await mutex.acquire ();
    console.log ( " -------------------->proc B has acquire lock ... " );
   
    let loc_ = "";
    while ( true )
    {
       await sleep ( 1000 );
       loc_ = loc_ + "b";
       console.log ( "b" + " --- " + loc_.length );
       if ( loc_.length > 40 )
       {
         rel();
         console.log ( " -------------------->proc B is giving up lock ... " );
         break;
        } 
    }
}
},2000)

