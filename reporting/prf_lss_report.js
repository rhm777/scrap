// todo:  may 29 , may 30 , may 31.
// aggregation queries.
// queries with array e.g. freq.table.
// check inheritance code.
// inplace runs.

const { TimeoutSettings } = require("puppeteer");

// concentrate on option cntx.
// but should be usable in forex cntx also.

//let trade_t  =  require ( "../trade_t")
//const clb        = require ("../common_lib")

//let mongo_db_ins = require ( "../mongo_db.js")
function prf_lss_report ( report_name , keep_trades = false , filter_by_days = 0 , filter_by_hours = 0)
{
    this.report_name            =   report_name 
    this.report_type            =   "prf_lss_report"
    this.tot_prf_lss_amount     =   0.0
    this.trade_count            =     0
    this.win_cnt = 0; 
    this.lss_cnt = 0; 
    this.buy_win_cnt = 0; this.buy_lss_cnt = 0;
    this.sell_win_cnt = 0 ; this.sell_lss_cnt = 0;  
    this.draw_cnt         = 0
    this.buy_prf_amount   = 0.0
    this.sell_prf_amount  = 0.0
    this.buy_lss_amount   = 0.0
    this.sell_lss_amount  = 0.0
    this.keep_trades      = keep_trades
    this.trades           = null
    if ( this.keep_trades == true )
        this.trades       = []
    this.filter_by_days   = filter_by_days
    this.filter_by_hours  = filter_by_hours
    this.time_filter      = null
    this.time_filter_ts   = null
    if ( this.filter_by_days > 0 || filter_by_hours > 0 )
    {
        this.time_filter = new Date();
        if ( this.filter_by_hours > 0 )
            this.time_filter.add_hours (filter_by_hours )
        if ( this.filter_by_days  > 0 )
            this.time_filter.add_days  (filter_by_date  )
        this.time_filter_ts    =   this.time_filter.getTime()
    }    
}
prf_lss_report.prototype.get_schema = function ( )
{
    //let ret_obj = { max_cnstv_wins: Number , max_cntv_lss:Number, cnstv_wins:Number , cnstv_lss:Number }
    //return ret_obj
    let ret_obj  =  {report_name:String , report_type:String,tot_prf_lss_amount:Number,trade_count:Number,win_cnt:Number,lss_cnt:Number,buy_win_cnt:Number,buy_lss_cnt:Number,sell_win_cnt:Number , sell_lss_cnt:Number,draw_cnt:Number,buy_prf_amount:Number,sell_prf_amount:Number,buy_lss_amount:Number,sell_lss_amount:Number,filter_by_date_hour:Number,filter_by_date_mins:Number}
    return ret_obj
}
prf_lss_report.prototype.get_object = function ( )
{
    let ret_obj  =  {report_name:this.report_name,report_type:this.report_type,tot_prf_lss_amount:this.tot_prf_lss_amount,
                    trade_count:this.trade_count,win_cnt:this.win_cnt,lss_cnt:this.lss_cnt,buy_win_cnt:this.buy_win_cnt,
                    buy_lss_cnt:this.buy_lss_cnt,sell_win_cnt:this.sell_win_cnt, sell_lss_cnt:this.sell_lss_cnt,draw_cnt:this.draw_cnt,
                    buy_prf_amount:this.buy_prf_amount,sell_prf_amount:this.sell_prf_amount,buy_lss_amount:this.buy_lss_amount,
                    sell_lss_amount:this.sell_lss_amount,filter_by_days:this.filter_by_days,filter_by_hours:this.filter_by_hours}

    return ret_obj
}

prf_lss_report.prototype.set_name  = function ( report_name )
{
    this.report_name = report_name
}
prf_lss_report.prototype.get_name  = function (  )
{
    return this.report_name
}

prf_lss_report.prototype.print     = function ( )
{
    if ( this.keep_trades == true )
    {
        for ( let a = 0;  a < this.trades.length; a++ )
        {
            this.trades[a].opt_print()
        }
    }
    console.log ( "[prf_lss_report.print] trade_cnt: "  + this.trade_count + " --- win_cnt: " + this.win_cnt + " -- lss_cnt: " + this.lss_cnt + " --- draw_cnt: " + this.draw_cnt )
    //console.log ( " -------> buy_win_cnt: " + this.buy_win_cnt + "---sell_win_cnt: " + this.sell_win_cnt + " --- buy_lss_cnt: " + this.buy_lss_cnt + " --- sell_lss_cnt: " + this.sell_lss_cnt )
    console.log ( "---------------------> tot_prf_lss_amount:" + this.tot_prf_lss_amount + " ---  " + " (" + this.buy_win_cnt + ") -- buy_prf_amount:" + this.buy_prf_amount + " -- (" + this.buy_lss_cnt + ") buy_lss_amount: " + this.buy_lss_amount)
    console.log ( " -------------------------------------------------> (" + this.sell_win_cnt + ") sell_win_amount:" + this.sell_prf_amount + " --- (" + this.sell_lss_cnt + ") sell_lss_amount: " + this.sell_lss_amount)
    console.log ( " -------- keep_trades: " + this.keep_trades + " --- date_filter--- days:" + this.filter_by_days + " --- hours:" + this.filter_by_hours )
}
prf_lss_report.prototype.apply_date_filter = function ( trade )
{
    if ( this.time_filter == null )
         return true
    if ( trade.get_open_time_ts > this.time_filter_ts )
         return true
    return false
}
prf_lss_report.prototype.add_trade = function ( trade )
{
    if ( this.apply_date_filter(trade) == false )
         return false
    if ( this.keep_trades == true )
         this.trades.push ( trade )
    
    //  console.log ( "current trade---outcome:" + trade.get_out_come() + " dir: " + trade.get_dir_str())
    this.tot_prf_lss_amount  =  this.tot_prf_lss_amount  +  trade.get_profit_loss_amount ()
    this.trade_count++
    let trd_prf_lss_amount  = trade.get_profit_loss_amount()
    if ( trade.get_out_come() == 1 )
    {
        this.win_cnt++
        
        if ( trade.get_dir () == 0 )
        {
            this.buy_prf_amount += trd_prf_lss_amount
            this.buy_win_cnt++
        }
        else if ( trade.get_dir () ==  1 )
        {
            this.sell_prf_amount  +=  trd_prf_lss_amount
            this.sell_win_cnt++
        }
    }
    else if ( trade.get_out_come() == -1  )
    {
        this.lss_cnt++
        
        if ( trade.get_dir () == 0 )
        {
             this.buy_lss_amount += trd_prf_lss_amount
             this.buy_lss_cnt++
        }
        else if ( trade.get_dir () ==  1 )
        {    this.sell_lss_amount  +=  trd_prf_lss_amount
             this.sell_lss_cnt++
        }
    } 
    else { this.draw_cnt++ }
    //console.log ( "in parent prf_lss_report ... ")
    return true
}
module.exports = prf_lss_report
