function event_receiver ( ins_name )
{
    this.ins_name   = ins_name 
}
event_receiver.prototype.receive  =   async function ( item )
{
  //  while ( true )
    //{
       // let item =  await this.queue_cons.consume ( );
        console.log ( " item received by " + this.ins_name )
        console.log ( item );
   // }
}
module.exports = event_receiver