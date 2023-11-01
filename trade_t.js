let common_lib = require ( './common_lib')


var trade_t  = function ( id ,  name, trade_type , symbol , dir, open_time , opn_prc , cls_prc ,  comment )
{
    this.r                  =  "none"
    this.point_val          =  0.0
    this.out_come            =  0
    this.prf_lss_pts        =  0
    this.id                 =  id
    this.ui_id              =  0
    this.status             =  0
    this.trade_type         =  trade_type        //opt/fx
    this.name               =  name 
    this.dir_str            =  "";
    this.dir                =  this.set_dir(dir)            //0 buy / 1 sell.
    this.symbol             =  symbol
    this.local_open_time_ts     =  Date.now()
    this.local_open_time_str    =  new Date(this.local_open_time_ts).toLocaleString()
    this.local_close_time_ts    =  0;
    this.open_time_ts     =  0
    this.close_time_ts    =  0
    this.open_time_str    =  ""
    this.close_time_str   =  ""
    this.open_price          =  0.0        //amount
    this.close_price          =  0.0
    this.duration_hr      =  0
    this.duration_mins    =  0
    this.comment          =  comment
    this.prf_lss_amt      =  0.0
    this.price_amt        =  0.0    // cost of the trade.
    this.err              = false
    this.err_description  = "none"
    this.err_code         = 0
};
trade_t.prototype.get_out_come   = function ( )
{
    return this.out_come
}
trade_t.prototype.set_trade_type = function ( trade_type )
{
    this.trade_type  =  trade_type
}
trade_t.prototype.get_trade_type  =  function ( )
{
    return this.trade_type
}
trade_t.prototype.set_point_val  = function ( point_val )
{
    this.point_val  = point_val
}
trade_t.prototype.get_point_val  =  function ( )
{
    return 1 / this.val
}
trade_t.prototype.get_point_size  =  function ( )
{
    return 1 / this.val
}

trade_t.prototype.get_schema_def = function ( ) { 
    return  { 
        r                  :  String,
        point_val          :  Number,
        prf_lss_pts        :  Number,
        out_come           :  Number,
        id                 :  Number,
        ui_id              :  String,
        status             :  Number,
        trade_type         :  String,        //opt/fx
        name               :  String, 
        dir_str            :  String,
        dir                :  Number,            //0 buy / 1 sell.
        symbol             :  String,
        local_open_time_ts     :  Date,
        local_open_time_str    :  String,
        local_close_time_ts    :  Date,
        open_time_ts     :  Date,
        close_time_ts    :  Date,
        open_time_str    :  String,
        close_time_str   :  String,
        open_price          :  Number,        //amount
        close_price          :  Number,
        duration_hr      :  Number,
        duration_mins    :  Number,
        comment          :  String,
        prf_lss_amt      :  Number,
        price_amt        :  Number,
        err              :  Boolean,
        err_description  :  String,
        err_code         :  Number
    } 
}

// 0 none  1 .. open 2..close 3..completed. 10..error
trade_t.prototype.set_error       =  function ( err , description , code )
{
    this.err = err; this.err_description=description;this.err_code=code
}
trade_t.prototype.set_name   =  function ( name_ )
{
    this.name = name_
}
trade_t.prototype.set_status      =  function ( status )
{
    this.status       =    status
}

trade_t.prototype.get_status      =  function ( )
{
    return this.status
}

trade_t.prototype.opt_print    = function  ( )
{
    console.log ( "trade_name: " + this.trade_name + " --- type:" + this.trade_type + "---id:" + this.id + " price_amount:" + this.get_price_amount() + " -- prf_lss: " + this.get_profit_loss_amount())
    console.log ( "symbol: " + this.symbol + " ---- dir_str: " + this.get_dir_str() + " --- open_prc: " + this.open_price + " -- close_prc: " + this.close_price )
    console.log ( "---- open_time(local):" + this.local_open_time_str + " --- open_time_ts: " + this.local_open_time_ts )
    console.log ( "---- close_time(local):" + this.local_close_time_str + " --- close_time_ts: " + this.local_close_time_ts )
    console.log ( "---- open_time_str:" + this.open_time_str + " --- open_time: " + this.open_time_ts )
    console.log ( "---- close_time_str:" + this.close_time_str + " --- close_time_ts: " + this.close_time_ts )
    console.log ( "---- duration(hr-sec):"  + this.duration_hr + " -- " + this.duration_mins )   
    console.log ("--err:" + this.err + " --err_description:" + this.err_description + " --code:" + this.err_code)
}

trade_t.prototype.update          =  function ( )
{
    this.prf_lss_pts     =   this.get_close_price () - this.get_open_price()
    if ( this.dir == 1 ) 
        this.prf_lss_pts = this.prf_lss_pts * -1.0;
    this.out_come  = this.get_outcome()
}
trade_t.get_profit_loss_points    =  function ( )
{
    return this.get_profit_loss_points * this.get_point_size()
}
trade_t.prototype.get_outcome     =  function ( )
{
    if ( this.get_trade_type() == "opt" )
        {
            if ( this.get_profit_loss_amount() > 0 )
                return 1
            else if ( this.get_profit_loss_amount() < 0 )
                return -1
            else return 0
        }
    else if ( this.trade_type == "fx" )
        {
            if ( this.get_profit_loss_amount() > 0 )
                return 1
            else if ( this.get_profit_loss_amount() < 0 )
                return -1
            else return 0
        }
}

trade_t.prototype.set_open_price  =  function ( price )
{   
    this.open_price    =    price 
}

trade_t.prototype.get_open_price  =  function ( price )
{   
    return this.open_price 
}
trade_t.prototype.get_close_price  =  function ( price )
{   
    return this.close_price 
}
trade_t.prototype.set_close_price  =  function ( price )
{   
    this.close_price    =    price 

}
trade_t.prototype.get_dur_hr   = function ( )
{
    return this.duration_hr
}

trade_t.prototype.get_dur_mins   = function ( )
{
    return this.duration_mins
}

trade_t.prototype.set_open_time_ts = function ( ts )
{
    this.open_time_ts  = ts 
}
trade_t.prototype.set_open_time_str = function ( tm_str )
{
    this.open_time_str = tm_str 
}
trade_t.prototype.set_local_open_time_ts = function ( ts )
{
    this.local_open_time_ts  = ts 
}
trade_t.prototype.set_local_open_time_str = function ( tm_str )
{
    this.local_open_time_str = tm_str 
}

trade_t.prototype.get_open_time_ts = function (  )
{
    return this.open_time_ts 
}
trade_t.prototype.get_open_time_str = function (  )
{
    return this.open_time_str
}

trade_t.prototype.set_close_time_ts = function ( ts )
{
    this.close_time_ts = ts
}
trade_t.prototype.set_close_time_str = function ( tm_str )
{
    this.close_time_str = tm_str 
}
trade_t.prototype.get_close_time_ts = function (  )
{
    return this.close_time_ts 
}
trade_t.prototype.get_close_time_str = function (  )
{
    return this.close_time_str
}
trade_t.prototype.get_local_close_time_str = function (  )
{
    return this.local_close_time_str
}

trade_t.prototype.get_local_close_time_ts = function (  )
{
    return this.local_close_time_ts
}


trade_t.prototype.set_id = function ( id )
{
    this.id       =    id
}
trade_t.prototype.get_id = function ( id )
{
    return this.id
}


trade_t.prototype.set_duration = function ( hr , min )
{
    this.duration_hr   = hr  
    this.duration_mins = min
    let given_date   =  new Date ( this.local_open_time_ts )
    given_date.add_hours ( this.duration_hr   )
    given_date.add_mins  ( this.duration_mins )
    this.local_close_time_ts  = given_date.getTime()
    this.local_close_time_str = given_date.toString()
}

trade_t.prototype.get_duration = function (  )
{
    return { hour: this.duration_hr , mins: this.duration_mins} 
}

trade_t.prototype.get_duration_str =  function ( )
{
    let tm_hour     = this.duration_hr;
    let tm_min      = this.duration_mins;
    let tm_hour_str = tm_hour + "";
    if ( tm_hour < 10 )
         tm_hour_str = "0" + tm_hour_str;
    let tm_min_str = tm_min + "";
    if ( tm_min < 10 )
        tm_min_str = "0"  + tm_min_str;
    let dur_str = tm_hour_str + " " + tm_min_str;
    return dur_str;
}

trade_t.prototype.set_dir =  function ( dir )
{
    if ( dir == 0 || dir == "buy" )
    {
            this.dir     = 0;
            this.dir_str = "buy";
    }
    else if ( dir == 1 || dir == "sell" )
    {
            this.dir = 1;
            this.dir_str = "sell"
    }
    //console.log ( this.dir_str )
}

trade_t.prototype.get_dir =  function ( )
{
    return this.dir;
}

trade_t.prototype.get_dir_str =  function ( )
{
   // console.log( this.dir )
    return this.dir_str;
}

trade_t.prototype.set_price_amount =  function ( price_amount )
{
     this.price_amt   =  price_amount;
}
trade_t.prototype.get_price_amount =  function ( price_amount )
{
    return this.price_amt  ;
}
trade_t.prototype.set_profit_loss_amount = function ( amount )
{
    this.prf_lss_amt  =  amount 
}

trade_t.prototype.get_profit_loss_amount =  function ( )
{
    return ( this.prf_lss_amt);
}

trade_t.prototype.set_symbol =  function ( symbol )
{
     this.symbol  = symbol;
}
trade_t.prototype.get_symbol =  function ( )
{
    return ( this.symbol );
}
/*
trade_t.prototype.trade_obj  =  function ( )
{
    var obj = { id:this.id , trd_type :this.trd_type , trd_name : this.trd_name };
    return obj;
}*/
trade_t.prototype.print      =  function ( )
{
    console.log ( this.trd_name );
   // console.log ( "[trade_t obj]  id:%j trd_name: %s  open_tm: %s " , this.id , this.trd_name ,   new Date ( this.open_time).toLocaleDateString()   );
    //console.log ( "---- close_tm: %s ", new Date ( this.close_time).toLocaleDateString() , " -- comment: %s",this.comment  )
    //console.log ( " -- trd_name: %s " , this.trd_name , " --- life_time: %j", this.life_time )
}

trade_t.prototype.from_str   =  function ( trade_str )
{   // create init this trade_ins from string.

}

trade_t.prototype.to_str   =  function (  )
{   // returns a string from this object.

}
/*
let trd = new trade_t ( 134 , "macd_1" , "opt","eur/usd", 0 )
trd.set_duration ( 1 , 10 )
trd.set_open_price ( 1.4131)
trd.opt_print()
*/

/*
let given_date  = new Date(trd.local_open_time_ts)
console.log ( given_date.toLocaleString() )
let new_date = given_date.get_copy()
new_date.add_hours ( 1 ); new_date.add_mins ( 10 )
console.log ( new_date.toLocaleString() )
*/

module.exports = trade_t;
