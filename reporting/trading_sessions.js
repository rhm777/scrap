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

let clb  =  require ("../common_lib")
function trading_session  ( name , tz_str , start_hour , start_min , end_hour , end_min )
{
    this.name           = name
    this.tz_str         = tz_str
    this.start_hour     = start_hour
    this.start_min      = start_min
    this.start_hour_min = this.start_hour + (  this.start_min == 0.0 ? 0 : this.start_min/60.0 )
    this.end_hour       = end_hour
    this.end_min        = end_min
    this.end_hour_min   = this.end_hour + this.end_min/60.0
}
trading_session.prototype.get_id = function ()
{
    let id   = this.tz_str + "_" + this.start_hour + "_" + this.start_min + "_" + this.end_hour + "_" + this.end_min
    return id
}
trading_session.prototype.get_time_in_session = function ( dt_tm_ts )
{
        let timeZone  =  this.tz_str
        let remote_date = clb.make_tz_date ( dt_tm_ts , this.tz_str )    
        console.log ( "remote:    " + remote_date.toString() + " --- " + this.tz_str )
        let hour_min = remote_date.getHours() + ( remote_date.getMinutes()==0.0 ? 0 : remote_date.getMinutes()/60)
        console.log ( " --- " + this.start_hour_min + " --- " + hour_min + " --- " + this.end_hour_min)
      
        if ( this.start_hour_min <=  hour_min && hour_min < this.end_hour_min  )
            return true
        return false
}

trading_session.prototype.print   =  function ()
{
    console.log ( "[trading_session.print] name: " + this.name +  " --- tz_str: " + this.tz_str + " start_hour: " + this.start_hour + " -- start_min: " + this.start_min + "----- end_hour:" + this.end_hour + " -- end_min: " + this.end_min )
    console.log ( " ----------------->   start_hour_min: " + this.start_hour_min + " --- end_hour_min: " + this.end_hour_min)
}

function trading_sessions (  )
{   // u.s. session.  u.s.session_after_noon. u.s.session_morning.
    this.sessions_map   = new Map()
}

trading_sessions.prototype.add    =  function ( name , tz_str , start_hour ,start_min, end_hour , end_min  )
{
    let trdng_sess    =  new trading_session(name ,tz_str , start_hour , start_min, end_hour , end_min )
    this.sessions_map.set ( trdng_sess.get_id() , trdng_sess )
}

// add the session return session_id.
trading_sessions.prototype.get_trade_sessions = function ( dt_tm_ts )
{   // dt_tm is from trades and it is locale time. before check change to require time.
    let given_dt  = new Date ( dt_tm_ts )
    let ret_obj   = []
    for ( let [ key , obj ]  of this.sessions_map.entries() )
    {
        //  console.log ( key )
          if ( obj.get_time_in_session ( dt_tm_ts ) )
               ret_obj.push ( obj )
    }
    return ret_obj    
}

trading_sessions.prototype.print   =  function ()
{
    console.log ( "[trading_sessions.print] length: " + this.sessions_map.size )
    for ( let [key, obj ] of this.sessions_map.entries())
    {
        console.log ( " key: " + key )
    }   
    console.log  ("")

}


module.exports = trading_sessions

// summary: some duration is static at remote. which is defined by session hours.
// trade has current time.
// which is converted into the tz time. and in duration is checked.
//let curr_tm  =  new Date()
//console.log ( curr_tm.toLocaleString())
//let trd = make_new_trade ( )
//console.log ( " for time: " + trd.get_open_time_str() )

//let trading_sessions_ = new trading_sessions ( )

//let trading_session_  = new trading_session ( "grp_1" , "America/New_York",9,30, 16, 00 )
 //   trading_sessions_.add ( trading_session_)
 //   trading_session_  = new trading_session ( "grp_1" , "Asia/Kolkata",7,30, 15, 30 )
 //   trading_sessions_.add ( trading_session_)
    
//let objs = trading_sessions_.get_trade_sessions( trd.get_open_time_ts())
//console.log ( "---------->" + objs[0].get_id() )




