// steps for implementation:
// create module for folder creation. e.g. dir , folder/folder1 etc.
// check async socket sending from yesterday.
// pltfrm_impl_olymp:
//       .init_symbol_mapping(["",""])      //
//       .open_trade  ( trade_t )
//       .close_trade ( trade_t )
// simulate trading by providing the trade object.
// use async and check if tab without doing focus can click on the object.
// note silent mode has no tab.
// try trades using socket. with setTimeout for the intermittent function.
// or use threading with thread_safety.

// same implementation can be for other platform.
// above layer provides logging of trades, and reporting.
// even above layer provides networking (receivingoftrade) of either msg_type. only.
// inheritance can be used as 
//              pltfrm  ---->   opt_pltfrm  --->  pltfrm_impl and new olymp_opt_pltfrm(.....)
// but inheritance is used.
// by providing components.                   


// problems: queueing. 
//           async requirest.
//           same tab request.
//           implement folder create routine as module. e.g. fs_helper.
//           or simple use mongoose and load from mongoose.
// this runs for single strategy name. e.g. strategy_1.

const  fs               =   require ("fs");
const  client           =   require ( "client_trd_msg_receiver");

function opt_pltfrm ( pltfrm_impl )
{   
    // has trade_lst sorted by time.
    this.open_trade_lst  =  [];
    this.pltfrm_impl     =  pltfrm_impl;
    this.pltfrm_impl.init_mapping ( ["EURUSD","GBPUSD","USDJPY"] );
}

opt_pltfrm.prototype.run         =  function ( )
{
    // check for close itermittently e.g.
    // every 30 seconds. keeps the open_trade_lst sorted by time. 
}

opt_pltfrm.prototype.open_trade  =  function ( trade )
{
    if ( this.pltfrm_impl.open_trade ( ) )
    {
        this.open_trade_lst.push ( trade );     // add trade.
        this.open_trade_lst.sort ( ( a, b ) => {  // sort the trade.
            return a.close_tm < b.close_tm;   
        });
    }
    else{
            //throw new Error ("");
    }
}

//  this should runned intermittenly every 30 seconds.
//  if there are trades in trade_lst.
opt_pltfrm.prototype.close_trade    =   function ( trade  )
{
    if ( this.pltfrm_impl.close_trade ( trade ) )
    {   // trade has been closed.
        let index  =  this.open_trade_lst.findIndex ( (ele) => ele.id == trade.id )
        this.open_trade_lst.splice ( index , 1 );
        this.on_trade_closed (  trade );
    }
}

opt_pltfrm.prototype.on_trade_closed   =   function ( trade )
{  // this trade has been closed. log this into the file of all_trades.

}



function pltfrm ( main_folder , host , port )
{   // has network socket which connects with server with msg_role="receiver"
    // receives a request string.
    // based on the request type = { opt|fx } receives a
    // trade_obj. if msg_type is opt it calls underlying opt. pltfrm to
    // open_trade.
    this.host          =    host;
    this.port          =    port;
    this.main_folder   =    main_folder;
    this.opt_pltfrm    =    null;
    this.fx_pltfrm     =    null;
    this.trade_lst     =    [];   // simple trade_list. 
}

pltfrm.prototype.init_folders              =  function ( )
{

}

pltfrm.prototype.set_opt_pltfrm  =  function ( opt_pltfrm )
{
    this.opt_pltfrm  =  opt_pltfrm;
}

pltfrm.prototype.open_trade    = function ( new_trade_obj )
{   
    // log the request obj into the file.
    if ( this.opt_pltfrm.open_trade ( new_trade_obj ) )
    {       // log the request open success.

    }
    else{
            // log the request open failed.
    }
} 

pltfrm.prototype.log_trade ( path_to_file ,  trade_obj )
{
    fs.appendFileSync ( path_to_file , trade_obj );    
}

pltfrm.prototype.run   =   function ( )
{   // listens on the socket , otherwise fails.
    while ( true )
    {
        setTimeout ( ()=>{}, 10000 );
        console.log ("breaking the loop.");
        break;
    }
}