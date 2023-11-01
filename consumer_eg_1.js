var data = [];

function Consumer()
{
    this.isConsuming = false;

    this.notify = async function(){
        console.log ( " recvd notify request --- length:" + data.length )
        if(this.isConsuming)
        {
            return;
        }
        await this.consumeNext();
    }
    this.notify_sync = async function(){
        console.log ( " recvd notify request --- length:" + data.length )
        if(this.isConsuming)
        {
            return;
        }
        this.consumeNext();
    }
  
    this.consumeNext = async function(){
        this.isConsuming = true;
        if(data.length > 0)
        {
            console.log ( " consume next data length: " + data.length )
            //consume one datum
            await this.consume(data.pop());

            //consume next datum
            await this.consumeNext();
        }
        else
        {
            this.isConsuming = false;
        }
    }

    this.consume = async function(datum){
        console.log ( "--------------------------------->recvd data:" + datum )
        for ( let i = 0; i < 4000000000; i++ );
        console.log ( "--------------------------------->done data:" + datum )
        return datum;
    }
}


async function a (){
var consumer = new Consumer();
//call consumer.notify() when your producer produces

console.log ( "push data 0-5");
data.push(1,2,3,4,5);   // data push is a sync function.
consumer.notify_sync();

console.log ( "push data 5-10");
data.push(6,7,8,9,10);
consumer.notify_sync();
/*
console.log ( "push data 11-15");
data.push(11,12,13,14,15); 
consumer.notify_sync();

console.log ( "push data 16-20");
data.push(16,17,18,19,20);
consumer.notify_sync();
*/
setTimeout ( ()=>{ console.log ( "push data 11-15");
data.push(11,12,13,14,15); consumer.notify();console.log ( "push data 16-20");data.push(16,17,18,19,20);}, 1 );


};
a();


