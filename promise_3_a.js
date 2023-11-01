

function r ()
{
    return (new Promise (  (resolve,err)=>{
     //       err("occured"); return ;
    setTimeout ( ()=>{},10000);
        resolve ( "the data ");
    }));
}
//let data = await await_promise;
r().then ( (data )=> {
console.log ( "--- prog ends: " + data );
}).catch ( (err) => {console.log (err);});