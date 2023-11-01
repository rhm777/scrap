const axios  =   require ( "axios" );

( async () =>{
    let lnk_data = null;

    async function get_link_data ( url  )
    {
        console.log ( "fetching url: " + url );
        await axios.get(url).then ( (response)=> { 
           console.log ( "response fetch with status:", response.status ); 
           if ( lnk_data ) lnk_data(response.data.title);  
        }); 
        
    }
    // return values of promise is data , which is a value of resolve.
    async function consume_link_data ( )
    {
        let await_promise = new Promise ( (resolve)=>{
              lnk_data = resolve; // it hangs here.   // provide callback func.
              console.log ( "consume lnk data" );// see eg.promise_3_a.
        })       
        let data = await await_promise;// get the value pass to the resolve function as discussed.
        console.log ( "link has been resolved for title:" + data )
        return data;
    }
    console.log ( Date.now() );
    let url = "https://jsonplaceholder.typicode.com/todos/1";
    get_link_data(url);
    //let data = await consume_link_data();
    //console.log ( "title-------->" + data );
    consume_link_data().then ( (data)=>console.log ( "title: " + data ) );
   // await get_link_data(url);
    
    
})();
