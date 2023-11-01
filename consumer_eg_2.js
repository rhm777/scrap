/*  today: april 19.
    implement module: to create a directory.
    start working on the  opt_impl_olymp.   apprx 5-7 days. 
    if impl. is done using mongoose, then you will be
    ready for next step of 1 month.
    approx. april 30.
*/
//  
/*
    producer.add_item.      ( trd_msg_obj )
    consumer.consume_item.  ( )  trd_msg_obj.
*/

let dataArray = []
let consumerResolver = null

function producer() {
    console.log ( "in producer " + dataArray.length );
    //let i = 0;
    //setInterval(() => {
     //   const newData = "my new Data_" + (++i);
    //    dataArray.push(newData)
        if (consumerResolver) {
            consumerResolver()
        }
        if ( consumerResolver == null  ) { console.log ( "consumer resover is null " ) ;}
    //}, 1000);
}

async function consumer() {   // following is the main part. as in thread_wait.
    while (true) {
        if (dataArray.length === 0) {
            console.log ( "waiting for item to be consumed .. no item. " );
            const producerPromise = new Promise((resolve) => {
                consumerResolver = resolve
            })
            await producerPromise
        }
        consumerResolver = null
        const data = dataArray.shift()
        console.log(data + " " + consumerResolver )
    }
}
consumer();
dataArray.push ( 1,2,3,4,5  );
producer();
dataArray.push ( 6,7,8,9,10 );

setTimeout ( producer , 10000 );
