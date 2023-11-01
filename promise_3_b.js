

let await_prmse =  (new Promise (  (resolve,err)=>{
      // resolve ( "the data ");
       err ( "---");
   }));

await_prmse.then((data)=>console.log ( data ) ).catch( err => console.log(err));

