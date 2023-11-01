

function queued_consumer ( max_cnt_req , producer )
{   // dispatches the event to the listeners.
    this.obj_arr      =  [];
    this.max_cnt_req  =  max_cnt_req;
    this.resolver =  null;
    if ( this.max_cnt_req == undefined ) 
         this.max_cnt_req = 40;

    this.listerner_list = [];
    this.producer       = producer;
}

queued_consumer.prototype.add_listener =  function ( receiver )
{
    this.listerner_list.push ( receiver );
}
queued_consumer.prototype.dispatch_listeners  =  async function ( obj )
{
    console.log ( "[queue_consumer.dispatch_listeners] for " + obj.trade_name )
    for ( i = 0; i < this.listerner_list.length; i++ )
    {
        let consumer_object  = this.listerner_list[i];
        await consumer_object.receive ( obj );
    }
}
//  await this.dispatch_listeners ( obj );
  
queued_consumer.prototype.consume    =   async function ( )
{
     while ( true )
     {
          let item = await this.producer.consume ( )
          console.log ( "[queued_consumer.consume]: listener.length:" + this.listerner_list.length  )
          await this.dispatch_listeners ( item )
     }
}

module.exports = queued_consumer