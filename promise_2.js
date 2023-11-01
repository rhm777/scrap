const axios  =   require ( "axios" );

const promiseA = new Promise ( (resolve , reject)=>
    {
        resolve ( 777 );
    }
)

promiseA.then ( (val) => console.log( "value returned: " + val ) );
console.log ( "exiting... ");
console.log ( "         " );
console.log ( "         " );

let promise_2  =   function promise_2 ( url  )
{
    return new Promise ( (resolve, reject )=>{
        axios.get(url).then ( (response)=> { console.log ( response.data); 
            resolve(response )} )
    })
}

let url = "https://jsonplaceholder.typicode.com/todos/1";
promise_2 ( url ).then ( (response) =>{
       // console.log ( response.status + " --- " + response.data );
        console.log( response.data.title );
})

url = "https://jsonplaceholder.typicode.com/todos/2";
promise_2 ( url ).then ( (response) =>{
        //console.log ( response.status + " --- " + response.data );
        console.log( "-------------------------" + response.data.title );
})

url = "https://jsonplaceholder.typicode.com/todos/3";
promise_2 ( url ).then ( (response) =>{
        //console.log ( response.status + " --- " + response.data );
        console.log( response.data.title );
})
