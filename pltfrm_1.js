/*  integrate  ui. for trade opening and closing as follows:
    open_req_queuue   ,  pending_close_queue , trade_list which are closed.
    implement reporting collection.                    

    if success;
    pass object to opt_platform. and begin to get instance there.
    define three functions of open_request , pending_close , close_trades.
    integrate the ui.  tomorrow   may 18.
    write the performance report. may 19.
*/

//const network_client       =   require("./network_client")
const queued_consumer      =   require("./queued_consumer") 
const consumer_producer    =   require("./consumer_producer");
const trade_receiver       =   require("./trade_receiver");
const trade_t              =   require("./trade_t")

// request received. added to producer, which is recieved by consumer
// queued , which sends to reciver list.
// this platform is encapsulated by opt_pltfrm or fx_pltfrm
// which is then encapsulated by olymp_opt_impl   or  olymp_fx_impl.

function  pltfrm   (  host , port , name_ , queued_cnt )   // receiver of trade in some cntx.
{   // only receives trade. i.e. name_ or strategy remains same. for reporting purposes.
    if ( queued_cnt == undefined ) queued_cnt = 40;
    this.cons_prod_opt   =   new consumer_producer ( queued_cnt );
    this.queued_consumer_opt  =  new queued_consumer ( queued_cnt , this.cons_prod_opt );
    this.queued_consumer_opt.consume()
    this.trade_receiver       =  new trade_receiver ( host , port , name_ , this )
    this.trade_receiver.register ()
    //this.cons_prod_fx      =   new consumer_producer ( queued_cnt );
    //this.queued_consumer_fx  =  new queued_consumer ( queued_cnt , this.cons_prod_fx );
}

pltfrm.prototype.add_listener_opt = function ( opt_message_listener )
{
    this.queued_consumer_opt.add_listener ( opt_message_listener );
}

pltfrm.prototype.add_listener_fx = function ( fx_message_listener )
{
   // this.queued_consumer_fx.add_listener ( fx_message_listener );
}

pltfrm.prototype.on_data_receive  =  function ( client_socket , obj )
{
   console.log ( "[pltfrm.on_data_receive]:" + client_socket.get_id() )
 //  console.log ( obj )
   if ( obj.your_name )
    console.log ( obj.message + "----" + obj.your_name )
   else if ( obj.local_open_time_ts != undefined ) {
      //  console.log ( "it is trade_object"  )
      //  console.log ( obj.id + " --- " + obj.trade_type + "--" + obj.open_price )
        let trd = Object.assign(new trade_t() , obj )
        //trd.opt_print()
        this.cons_prod_opt.produce ( trd )
    }
}
module.exports = pltfrm
/*   // example to receive trade object.
let plt_frm_   =   new  plt_frm ( '127.0.0.1' , 7777 , "macd_1" )

function queued_listener_test  ( )
{

}
queued_listener_test.prototype.receive = function( obj )
{
    console.log ( " ------   " )
    console.log ( obj.id + " --- " + obj.local_open_time_str + " --- " + obj.local_open_time_ts )
    console.log ( " ------   " )

}
plt_frm_.add_listener_opt ( new queued_listener_test () )
*/