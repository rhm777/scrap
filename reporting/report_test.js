
let trade_t       = require ("../trade_t")
const clb        = require ("../common_lib")
let simple_report = require("./simple_report")
// add date filter or some duration so that trade older than
// that duration is not added. don't test it.
// i.e. if not later than 48 hours, if close time > open time is less from current-48hours
// then don't include it.
// what is aggregate query in mongodb. i.e. groupby.
// save reports with different format including array for simple report.
// implement advance report which only have sharpie ratio etc.
// implement complete report specification only.

// implement advance report with daynoofweeke.g./tueusday,thrusday/ weekly / monthly statistics.
// or by sessions.
// this all depends on the date manipulations.
// 
let n  = new Date()
console.log ( n.toString() )
console.log ( n.getMonth())
n.add_hours (  1.5*20 )
console.log ( n.toString() )
console.log ( n.getMonth())
// therefore date filter takes  no of day and hours ago from current time.
// and skip those trades from the calculations.    
// also collect_trade option can be true or false.
// for advance_report.
// skip trade is used.
//console.log ( " return " )
//return 

function make_new_trade ( )
{
    let symb_arr = ["eurusd","gbpusd", "usdjpy", "usdchf","gbpjpy","eurjpy","chfjpy"]
    let names_arr  = ["macd_1","rsi_1","stochastic_1","moving_avg_1","moving_avg_2"]
    let trade = new trade_t ()
    trade.r = "abcd"
    trade.set_trade_type ( "opt" )
    trade.set_open_price ( Math.random() * 100 )
    trade.set_close_price    ( Math.random() * 100 )
    let no = Math.floor( Math.abs(Math.random()) * (symb_arr.length-1))
 //   console.log ( "---" + (symb_arr.length-1) + " --- " + no )
    trade.set_symbol ( symb_arr[ no ] )
    no = Math.floor( Math.abs(Math.random()) * (names_arr.length-1))
 //   console.log ( "---" + (names_arr.length-1) + " --- " + no )
    trade.set_name   ( names_arr [no])
    no = Math.floor( Math.abs(Math.random() * 2) )
    trade.set_dir ( no )
    point_val = 0.0001; 
    if (trade.get_symbol().includes("jpy")) 
        point_val = 0.01
    trade.set_point_val ( point_val )
    trade.set_price_amount ( clb.random_range ( -10 ,10) )
    no = clb.random_range ( 0 , 2 )
    let profit_amount = trade.get_price_amount()
    if ( no == 0 ) profit_amount = profit_amount * -1
    trade.set_profit_loss_amount ( profit_amount )
    trade.update()
    return trade
}

/*   fix trade for prf_lss_pts and point_val.   point_size() .. set_prf_lss_pionts,get__
     fix reporting with cnstv_win freq.
     what is aggregate query. 
     how to save array fields.
     aggregate query with array.
     implement update.
     if schema is changing then new fields will not be visible.
     e.g. date_str usually is not saved but present on the object.
*/


let smpl_rep   =  new simple_report ( )
for ( let a = 0; a < 10; a++ ){
    let trd_0      =  make_new_trade()
    smpl_rep.add_trade ( trd_0 )
}
smpl_rep.print ( )

