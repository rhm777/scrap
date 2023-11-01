

var  trade_t    =     require ( "./trade_t" );

// this is needed due to logging require example.
// logging of req.str. logging of open_success file.
// sorting of list also by time.

// trade_open_opt_lst_t which has expiry mechanism and needs to sort the 
// list. which does the inheritance.
// trd_plffrm --> opt_trd_pltfrm ,  uses trade_opn_opt_lst_t instead of open_lst. 
// 
// UI for report checking is via shared folder.
// and uses http express.
// shows report with simple UI using templates.
// it creates trade_report from all_closed_trades, per symbol close trades,
// per symbol open trades. being written by.
// trd_pltfrm.is_trade_close logic.
// trd_pltfrm [ opn_trd(), close_trd, is_trd_closed, run() ].
// now read and practise with networking , and inheritance.  

// summary:
// trd_platform  --->   opt_trd_pltform
//              funcs:  par run()//networking
//                      par.open_trd     // from req_str in networking.      
//                      is_trade_close   //   
// trd_platform  ---->  fx_trd_pltform  [ trd can be modified, etc.]
// generic actions are pending orders , cancel, force close trade.
//


var  trade_lst_t   =   function ( )
{
    this.trade_map      =   new Map();
  //  this.trade_queue    =   new Array();   // sort trades by object example, by close time.

};
trade_lst_t.prototype.add   =   function ( trade  )
{   // add to both list.
    this.trade_map.set ( trade.id , trade );
    //this.trade_queue.push ( trade );
    //this.trade_queue.sort ( );
}

trade_lst_t.prototype.remove  =   function ( trade )
{
    this.trade_map.remove ( trade.id );
    
    //this.trde_lst_t.delete ( index );   // implement using call back.

}


