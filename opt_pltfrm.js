/*
    implement opt_pltfrm.
    encapuslates pltfrm_1.
    gets event.
    maintains three queues.
    to_be_opened_queue , pending_close_queue , close_list.
    does report generation using mongoose.
    later implement report watching using http, for 
    particular strategy.
    don't worry about external struct e.g. trade_lst etc.
    following are the problems:
    set_interval runs concurrently without the this. use bind.
    network event receiver also works with it.
    at first only implement console.log and observe.
    then use mutexes as previously done.
    then integrate ui.
    then fix for trade_close reading etc. using queues as follows:
    trades are readed till some id or some time.
    readed trades are sorted in ascending order by close time
    pending open trades are by ascending order of open time.
    pending close trades are by ascending order of close time.
    readed close trades moves pending close to close trades.
    close then are written to database. for report viewing.
    report viewing are first page is sorted by dual field,
    pf , win rate etc.
    currency to multiple strategy report.
    strategy to currency report.
    work very hard on the view to get knowledge of ui.
    work with some strategy finding....

*/

//let  trade_t            =   require ( "./trade_t" )
//let  trade_lst_w_queue  =   require ( "./trade_lst_w_queue" )

const pltfrm      =   require ( "./pltfrm_1")
const common_lib  =  require ( "./common_lib")
const Mutex       =  require ("async-mutex").Mutex
// has receiver object. added as listener into the plf_frm.
// note opt_impl has two functions, process_close_trade or read_close_trades
// and other open_trade.

function opt_pltfrm ( opt_impl , serv_addr , serv_port , name_ ) // plt_frm is listener.
{
    //this.trade_lst_w_queue  =  new trade_lst_w_queue();
    this.serv_addr  =    serv_addr 
    this.serv_port  =    serv_port
    this.name       =    name_
    this.pltfrm    =    new  pltfrm ( this.serv_addr , this.serv_port , this.name )
    this.pltfrm.add_listener_opt ( this )
    this.opt_impl   =    opt_impl
    this.serv_addr  =    serv_addr;
    this.pending_open_list  = []//new Array( )  // sort by none. fcfs.
    this.pending_close_list = []//new Array( )  // sort by closing_time.
    this.close_list         = []//[]new Array( )  // sort by none. but sort by close_time default.
    this.ui_mutex           = new Mutex( )
    this.check_for_closing()
    this.server_start_tm    = Date.now()
    this.server_start_tm_str = new Date ( this.server_start_tm).toString()
    console.log ( "[server start_time]:" + new Date(this.server_start_tm).toString())
    // there is a mutex here.
}
// there are no orders in pending open.
// or pending orders is greater than 10. read_cnt is all.
// interval is 5 minutes default.
// reads are by timestamp or last_readed_id. if any.
opt_pltfrm.prototype.get_ui_mutex     = async function  ( )
{
    let rel = await this.ui_mutex.acquire ( )
    return rel
}

opt_pltfrm.prototype.get_last_trade_close_time = function ( )
{
    if ( this.pending_close_list.length == 0 )
        return undefined
    let last_trade = this.close_list[this.close_list.length-1]   // last trade is remove.
    return last_trade.local_close_time_ts
}

opt_pltfrm.prototype.get_server_start_time = function ( )
{
    return this.server_start_tm
}
opt_pltfrm.prototype.check_for_closing = async function ( )
{
    let interval       = 30000
    console.log ( "[opt_pltfrm.check_for_closing] runned ------------> ")
   
    setInterval( async () => {
           console.log ( "[opt_pltfrm.check_for_closing] runs every 30 secs: " + this.pending_open_list.length )
           console.log ( "[opt_pltfrm.check_for_closing] runs every 30 secs: " + this.pending_close_list.length )
           let last_trade_id = 0
           // acquire mutex here.
           if ( this.pending_open_list.length > 0 )
              return
           if ( this.close_list.length > 0 )
           {
               for ( let trd of this.close_list )
                   trd.opt_print()
           }   
           let rel = await this.get_ui_mutex ( );
           console.log ( "following ids are needed to be completed ")
           let curr_ts = new Date().getTime(); let curr_tm_str = new Date().toString()
           console.log ( "*************************current_tm_str: " + curr_tm_str  + " -- ts: " + curr_ts )
           if ( this.close_list.length > 0 )
           {let last_trade  =  this.close_list[this.close_list.length-1]
              last_trade_id   =  last_trade.get_id()
              last_trade_id   =  0
           }
           let closing_id_map = new Map()
           for ( let i = 0; i < this.pending_close_list.length; i++ )
           {
               let trd = this.pending_close_list[i];
               console.log ( "[opt_pltfrm.check_for_closing] -------> trade_id: " + trd.get_id() )
               console.log ( "*************************open_time_str: " + trd.get_open_time_str() +  "-------------------->close_time:" + trd.get_close_time_str() + " --- ts:" + trd.get_close_time_ts() )
               if ( (trd.get_close_time_ts() + ( 10*1000)) < curr_ts ){
                  console.log ( "************** ABOVE TRADE HAS EXPIRED********* ")
                  trd.set_status (  2 )   // trade has been closed.
                  closing_id_map.set ( trd.get_id() , trd ) 
               }
           }
           if ( closing_id_map.size > 0 )
           {
               await this.opt_impl.get_closed_trades_info ( closing_id_map,20,last_trade_id )
               for ( let [ trade_id , trd ] of closing_id_map )
               {
                    if ( trd.get_status ( ) !=  3 )
                        continue
                    let index = this.pending_close_list.findIndex ( (ele)=>{
                            return trade_id == ele.get_id()
                       } )
                    if ( index != -1 ){
                            this.pending_close_list.splice ( index , 1 )
                            this.close_list.push ( trd ) 
                       } 
               }
           } 
           console.log ( "exiting setinter... pending close length: " + this.pending_close_list.length + " --- close_list.length:" + this.close_list.length)
           rel()
    } , interval );
    
}

// this communicates with ui. using mutexes.
// along with check_for_closing.
opt_pltfrm.prototype.receive          = async function ( obj )
{
    console.log ( "[opt_pltfrm.receiver] receive trade  ")
    console.log ( " ------   " )
    console.log ( obj.id + " --- " + obj.local_open_time_str + " --- " + obj.local_open_time_ts )
    console.log ( " ------   " )
    this.pending_open_list.push  ( obj )
    //this.pending_close_list.push ( obj )
    await this.process_pending_opens ( )
}
// do sort practise.
// sort pending close.
// then in closing. check if trade has expired. gather in
// trade_id_arr and send to closing. receiving close trades
// and remove from pending close and move to close list.
opt_pltfrm.prototype.process_pending_opens = async function ()
{
    let rel = await this.get_ui_mutex ( )
    
    while ( this.pending_open_list.length > 0  )
    {
        let trade = this.pending_open_list.shift()
        console.log ( "[opt_pltfrm] processing trade: " + trade.id + " --- length:" + this.pending_open_list.length )
        if ( await this.opt_impl.open_trade ( trade ) == true )
        {
            //common_lib.sleep(10000)
            trade.set_status ( 1 )
            this.pending_close_list.push ( trade )       
            console.log ( "[opt_pltfrm] success open trade... close_list_length: " + this.pending_close_list.length + " finish processing trade: " + trade.id + "--" + trade.local_close_time_ts )
            this.pending_close_list.sort ( (a,b) =>{
                console.log( "comapring:" + a.get_local_close_time_str() + " -- " + b.get_local_close_time_str())
                return  (a.get_local_close_time_ts() > b.get_local_close_time_ts() ? 1:-1)
            })
        }
        else{
            console.log ( "[opt_platform failed opening trade: " + trade.get_id() )
        }
        trade.opt_print()
    }
    rel ( )
}

//let opt_pltfrm_  = new opt_pltfrm ( null , '127.0.0.1', 7777 , "macd_1" )
module.exports  =   opt_pltfrm

