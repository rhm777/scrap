// trading session used in reporting.
// to identify if some trade.open time falls in that trading session.
// to assign the trade come to that session reporting.
// may 1 and may 2.
// all agrs for tz.
// imlement tz diff.
// implement in_range.
// implement expiry.
// saving of report and retrieving.
// group by clause for db.
// 11:30 p.m.

//let clb  =  require ("../common_lib")

function trading_session ( name , tz_str , start_hour, start_min, end_hour, end_min )
{   // u.s. session.  u.s.session_after_noon. u.s.session_morning.
    this.name           = name
    this.tz_str         = tz_str
    this.start_hour     = start_hour
    this.start_min      = start_min
    this.start_hour_min = this.start_hour + (  this.start_min == 0.0 ? 0 : this.start_min/60.0 )
    this.end_hour       = end_hour
    this.end_min        = end_min
    this.end_hour_min   = this.end_hour + this.end_min/60.0
}
trading_session.prototype.print   =  function ()
{
    console.log ( "[trading_session.print] name: " + this.name +  " --- tz_str: " + this.tz_str + " start_hour: " + this.start_hour + " -- start_min: " + this.start_min + "----- end_hour:" + this.end_hour + " -- end_min: " + this.end_min )
    console.log ( " ----------------->   start_hour_min: " + this.start_hour_min + " --- end_hour_min: " + this.end_hour_min)
}

trading_session.prototype.date_in_session  =   function ( date_ts )
{
    // convert date to given session.
    let given_dt  = new Date ( date_ts )
    let tm_zn  = `{'${this.tz_str}',hours12:false}`
    
    let timeZone  = this.tz_str
    let remote_locale_str   =  given_dt.toLocaleString('en-US', { timeZone, hour12: false })
    let dt     =  new Date ( remote_locale_str )

    console.log ( "trade_tm local: " + dt.toLocaleString() )
    console.log ( "trade_tm: remote:" + remote_locale_str )    
    let hour_min = dt.getHours() + ( dt.getMinutes()==0.0 ? 0 : dt.getMinutes()/60)
    console.log ( dt.getHours() + " --- " + dt.getMinutes() + "---" + hour_min  )
    console.log ( this.start_hour_min + " --- " + hour_min + " -- " + this.end_hour_min )
    if ( this.start_hour_min <=  hour_min && hour_min < this.end_hour_min  )
        return true
    return false
}   

trading_session.prototype.get_id  =  function ()
{
    return this.name + "_" + this.start_time + "_" + this.end_time 
}

let trade_t = require("../trade_t")
let clb     = require("../common_lib")

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
    let curr_date = new Date()
    let hours = clb.random_range(1,300)* -1
    let mins  = clb.random_range(1,300)* -1
    curr_date.add_hours ( hours )
    curr_date.add_mins  ( mins  )
    trade.set_open_time_str ( curr_date.toString()  )
    trade.set_open_time_ts  ( curr_date.getTime()   )
    trade.update()
    return trade
}

{
let trd = make_new_trade ( )
//let curr_tm  =  new Date ()

let trd_sess  = new trading_session ( "grp_1" , "America/New_York",9,30, 16, 00 )
trd_sess.print()
let res = trd_sess.date_in_session ( trd.get_open_time_ts() )
console.log ( " in session = " + res )
}

// 9:30 a.m.  - 4:00 p.m.
//let ts = new trading_session ( "test","" , "America/Newyork", new Date() , new Date() )
//console.log ( ts )
//ts.print ( )
/*
let curr_tm  =  new Date ()
let nyc_tm   =  curr_tm.toLocaleString ( "en-US", {timeZone:'America/New_York'})
curr_tm.add_hours ( curr_tm.getTimezoneOffset())
console.log ( curr_tm.toLocaleString() )
console.log ( nyc_tm )
*/


