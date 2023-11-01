
// inherits from trade_lst.
// note: request to open will open a trade in pltfrm.
// pltfrm closes the trade w most recent to be expired.
// trade is added to the queue. as well the trade_map.
// remove is inherited by queue and remove from underlying also,
// which is a map.
// every n second checks new trades which are closed.
// queue is sorted , there always has last trade to be closed.
// pltfrm can break loop from last_trade_id if any, which is provided
// pltfrm also has till time, which is when started and includes only
// valid trade.
// therefore now checks for time api etc.
let trade_lst_t   =    require( "./trade_lst_t" )



function trade_lst_w_queue ( )
{  // inherits from above. override add.
    this.last_trade_id  = undefined;
    this.trade_queue  = new Array();  
    // calls to bind etc.

}
trade_lst_w_queue.prototype.get_last_trade_id ( )
{
    return this.last_trade_id ;
}
trade_lst_w_queue.prototype.set_last_trade_id ( trade_id )
{
    this.last_trade_id  =   trade_id; 
}
// implement inheritance logic here.
trade_lst_w_queue.prototype.add  =  function  ( trade_obj )
{
    this.trade_queue.push ( trade_obj );  // also add to super.
    // now sort this queue.
    this.trade_queue.sort ( (a,b)=>{
        return (a.close_tm < b.close_tm );
    })
}

trade_lst_w_queue.prototype.dequeue  =  function  ( trade_obj )
{
    this.trade_queue.shift ( trade_obj ); // also remove from super.
}


module.exports = trade_lst_w_queue