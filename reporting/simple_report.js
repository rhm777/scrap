
// adds win_cnt , lss_cnt  , prf_amount  loss amount,  
// inherits from above.
const { TimeoutSettings } = require("puppeteer")
let prf_lss_report = require ("./prf_lss_report")
let mongo_db       = require ("../mongo_db")

function simple_report ( report_name , keep_trades=true , filter_by_days=0 , filter_by_hours=0 )    // above may not be needed.
{  // inherits from prf_lss_report.
    prf_lss_report.call ( this , report_name , keep_trades , filter_by_days , filter_by_hours )
    //this.report_name            = report_name
    this.report_type     = "simple_report_type"
    this.max_cnstv_wins  = 0
    this.max_cnstv_lss   = 0
    this.cnstv_wins      = 0
    this.cnstv_lss       = 0
    this.cnstv_win_count  = new Map()  // occurence sum of individual count.
    this.cnstv_lss_count  = new Map()
    this.prev_outcome    = 0
}
Object.setPrototypeOf( simple_report.prototype  , prf_lss_report.prototype )

simple_report.prototype.get_schema  =  function ( )
{
    let prf_lss_schema  =  prf_lss_report.prototype.get_schema.call ( this )
    //console.log ( prf_lss_schema )
    let simple_report_schema = { max_cnstv_wins:Number, max_cnstv_lss:Number,cnstv_wins:Number,cnstv_lss:Number, cnstv_win_count:Map, cnstv_lss_count:Map}
        simple_report_schema = Object.assign ( simple_report_schema , prf_lss_schema )
    return simple_report_schema
}

simple_report.prototype.print     =  function (  )
{
   // prf_lss_report.prototype.print.call ( this )
    this.report_type  =  "simple_report"
    console.log ( "[simple_report.print] report_name: " + this.report_name + " -- type:" + this.report_type + " ----- max_cnstv_wins:" + this.max_cnstv_wins + " --- max_cnst_lss_cnt: " + this.max_cnstv_lss)
    console.log ( "-----freq for cnstv_win:  " + this.cnstv_win_count.size) 
    console.log ( "-----freq for cnstv_loss: " + this.cnstv_lss_count.size) 
    
    
    let  orders  = this.cnstv_win_count.entries()
    for ( [key,val] of orders )
    {
        console.log ( "----------------->key: " + key + " count: " + val)
    }
    console.log ( "-----freq for cnstv_loss: " + this.cnstv_lss_count.size) 
    orders  = this.cnstv_lss_count.entries()
    for ( [key,val] of orders )
    {
        console.log ( "----------------->key: " + key + " count: " + val)
    } 
}

simple_report.prototype.add_trade =  function ( trade )
{
    if ( prf_lss_report.prototype.add_trade.call ( this, trade ) == false )
         return false 
    
    if ( trade.get_out_come() == 1 )  // win.
    {
        //if ( this.prev_outcome ==  0 )
        //     this.prev_outcome = 1
        if ( this.prev_outcome == -1 )  // oss streak is over.
        {
            this.max_cnstv_lss  =  Math.max(this.max_cnstv_lss , this.cnstv_lss)
        //    if ( this.cnstv_loss > 0  ){
            if ( (curr_cnstv_lss_cnt = this.cnstv_lss_count.get( this.cnstv_lss)) == undefined )
                  this.cnstv_lss_count.set( this.cnstv_lss.toString(),1)
            else
                  this.cnstv_lss_count.set( this.cnstv_lss.toString(), ++curr_cnstv_lss_cnt)
         //   }
            this.cnstv_lss = 0
            this.prev_outcome = 1;
        }
        this.cnstv_wins++
        this.prev_outcome = 1     
    }
    else if ( trade.get_out_come () == -1 )
    {
        
        
        if ( this.prev_outcome == 1 )
        {
           // if ( this.cnstv_wins > 0 ){
            this.max_cnstv_wins = Math.max(this.max_cnstv_wins ,this.cnstv_wins )
            if ( (curr_cnstv_win_cnt = this.cnstv_win_count.get( this.cnstv_wins ) )== undefined )
                  this.cnstv_win_count.set ( this.cnstv_wins.toString(),  1 )
            else
                  this.cnstv_win_count.set ( this.cnstv_wins.toString() , ++curr_cnstv_win_cnt )
           // }
            this.prev_outcome = -1; 
            this.cnstv_wins  = 0 
        }    
        this.cnstv_lss++
        this.prev_outcome = -1    
    }
  //  console.log ( this.cnstv_wins + "----" + this.cnstv_lss )
}


let trading_sessions  =  require ( "./trading_sessions" )

function advance_report ( report_name , keep_trades = false , filter_by_date = 0 , filter_by_time = 0 )
{
    simple_report.call ( this , report_name , keep_trades , filter_by_date , filter_by_time )
    //this.report_name   =   report_name
    this.report_type   = "advance_report"
    this.year_map      =   new Map()
    this.month_map     =   new Map()
    this.week_day_map  =   new Map()
    this.session_map   =   new Map()
    this.trading_sessions  =  new trading_sessions ( )
}
Object.setPrototypeOf ( advance_report.prototype , simple_report.prototype )
advance_report.prototype.get_schema  =  function ( )
{
    let simple_report_schema  =  simple_report.prototype.get_schema.call ( this )
    //console.log ( prf_lss_schema )
    let advance_report_schema = { year_map:Map, month_map : Map , week_day_map : Map , session_map: Map}
        advance_report_schema = Object.assign ( advance_report_schema , simple_report_schema )
    return advance_report_schema
}

advance_report.prototype.add_trading_session = function ( name , tz_str , start_hour , start_min , end_hour , end_min )
{
    this.trading_sessions.add ( name , tz_str , start_hour , start_min , end_hour , end_min )
}
advance_report.prototype.add_trade =  function ( trade )
{
    if ( simple_report.prototype.add_trade.call ( this , trade ) == false )
         return false       
    //  create index of  months. if not exists.  month_map.
    //  create index of  year    if not exists.  year_map.
    //  create index of  sessions if not exists. session_map.
    //  create index of  week_day_no if not exists. week_day_map.
    //  for each such entry add report of type prf_lss_pts.

    // what is year ,  what is month , what is week_day_no , what is session.
    let trd_open_dt_tm   =  new Date ( trade.get_open_time_ts ( )  )
    console.log ( "open_time: " + trade.get_open_time_str() )
    let trd_year  =  trd_open_dt_tm.getFullYear()
    let trd_month =  trd_open_dt_tm.getMonth ( )
    let trd_week_day  =  trd_open_dt_tm.getDay()
    let trd_hour      =  trd_open_dt_tm.getHours()
    // note: for each type of report needing e.g. yearly , monthly, week_day_no , daily sessions.
    // there is a map. which has unique id , e.g. month_no , year_no , session_id.
    // in it there is a report by that id , if not create one.
    // then add trade to that report. 

    let session_id    =  trd_hour
    //console.log ( "year: " + trd_year + " -- month: " + trd_month + " -- day: " + trd_week_day + " -- hour: " + trd_hour )
    let year_report  =  this.year_map.get ( trd_year )
    if ( year_report == null ){ 
          year_report = new prf_lss_report ()
    }
    this.year_map.set ( trd_year.toString() , year_report ) 
    
    let month_report  =  this.month_map.get ( trd_month )
    if ( month_report == null ){ 
          month_report = new prf_lss_report ()
    }    
    this.month_map.set ( trd_month.toString() , month_report ) 
    
    let week_day_report  =  this.week_day_map.get ( trd_week_day  )
    if ( week_day_report == null ){ 
          week_day_report = new prf_lss_report ()
    }
    this.week_day_map.set ( trd_week_day.toString() , week_day_report ) 
    
    year_report.add_trade     ( trade )
    month_report.add_trade    ( trade )
    week_day_report.add_trade ( trade )
    let trading_sessns      =  this.trading_sessions.get_trade_sessions ( trade.get_open_time_ts() )
    // for each trading_sessns. get_unique_id. and add reporting.
    for ( let  trading_session  of trading_sessns )
    {   
        //let trading_session  =  trading_sessns[i]
        let session_report  =  this.session_map.get ( trading_session.get_id()  )
        if ( session_report == null ){ 
            session_report = new prf_lss_report ()
            let id         = trading_session.get_id()
            this.session_map.set ( id.toString(), session_report ) 
        }
        session_report.add_trade ( trade )   // add to this session report.
    }
}
// 
advance_report.prototype.print    =  function (       )
{
   console.log ( "[advace_report.print]:" + this.report_name )
   for ( let [key, obj ] of this.session_map )
   {
       console.log ( key )
       console.log ( obj )
   }
   // this.trading_sessions.print()
   // print reporting of advance_report.  

}

let trade_t = require("../trade_t")
let clb     = require("../common_lib")

//let adv_rep   =   new  advance_report ( )
//adv_rep.add_trading_session ( "new-york session", "America/New_York",9, 30 , 16,  30 )
//adv_rep.add_trading_session ( "kolkata  session", "Asia/Kolkata" , 7 , 30 ,  15 , 30 )
// now add trades to adv_report.
//adv_rep.print()

//module.exports = simple_report


//let trade_t = require("../trade_t")
//let clb     = require("../common_lib")

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
    trade.set_price_amount ( clb.random_range ( 1 ,10) )
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
    trade.set_local_open_time_str ( trade.get_open_time_str()  )
    trade.set_local_open_time_ts  ( trade.get_open_time_ts()   )
    
    trade.update()

    return trade
}
// add function for reports to be utilized. e.g. adv. report also.
// execute group by queuries for validity.
/*
async function e () {
let mongo_db_  = new mongo_db ( '127.0.0.1', 27017 ,"opt_11" )
//mongo_db_.add_schema ( "prf_lss_report", new prf_lss_report().get_schema() )
//mongo_db_.add_schema ( "simple_report" , new simple_report().get_schema() )
mongo_db_.add_schema ( "advance_report" , new advance_report().get_schema() )
let objs   =  await mongo_db_.find_obj ( "advance_report","")
console.log ( objs.length )
for ( let row of objs )
{
   let mp = row["week_day_map"]
   for ( let [key, obj]  of mp ){
    console.log ( "key: " + key + " --- tot_prf_lss_amt:" + obj.cnstv_win_count )
    console.log( obj)
   }
   console.log ( row["cnstv_win_count"])
   break
}*/
//let adv_report  =  new advance_report ("adv_rep_1",false )
//adv_report.add_trading_session ( "new-york-8-hours" , "America/New_York",9,30, 16, 00 )
//adv_report.add_trading_session ( "calcutta-8-hours" ,  "Asia/Kolkata",7,30, 15, 30 )
//for ( let i = 0; i < 50; i++ ){
//let trd   =  make_new_trade()
//adv_report.add_trade ( trd )
//}
//mongo_db_.save_obj ( "advance_report",adv_report )
//adv_report.print()

//}
//e()

/*
async function l (){
let mongo_db_  = new mongo_db ( '127.0.0.1', 27017 ,"opt_8" )
mongo_db_.add_schema ( "prf_lss_report", new prf_lss_report().get_schema() )
mongo_db_.add_schema ( "simple_report" , new simple_report().get_schema() )

let reports = await mongo_db_.find_obj("simple_report","max_cnstv_lss > 3",{},{ trade_count:true, win_cnt:true, lss_cnt:true,max_cnstv_wins:true, max_cnstv_lss:true})
console.log ( reports )
}
l() */
//console.log ( prf_lss_report_.get_object() )
//let simple_report_ = new simple_report ( "simple_report_1", false )
//let trd  =  make_new_trade ( )
//simple_report_.add_trade ( trd )
//simple_report_.print()

//simple_report_.get_schema ( )
//mongo_db_.save_obj ( "simple_report" , simple_report_ )

/*
let a = 0
let rep = null
while ( a < 8 )
{  // a++
    let simple_report_  =  new simple_report ( "test_report_1", true )

    let count = clb.random_range ( 50,100)
    for ( let a = 0; a < count ; a++ ){
        let trd = make_new_trade ( )
        simple_report_.add_trade ( trd )
    }
    //prf_lss_report_.print()

    mongo_db_.save_obj ( "simple_report" , simple_report_ )
    a++
    rep = simple_report_
}*/
//rep.print()

