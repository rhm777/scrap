// this function gives api to save data.
// it uses mongoose.

// following uses mongoose.
// for abstraction use save_object , read_object api. 
// which implementation provides. e.g. like_search , read_by_query etc.
const { default: axios } = require("axios");
const mongoose = require ( "mongoose" )
const {trade_model} = require ( "./trade_model")
const trade_t       = require ("./trade_t")

function trd_pltfrm_db ( host , port , db_name )
{
    this.host = host ; this.port = port ; this.db_name = db_name
    this.init_connection ( )

}
trd_pltfrm_db.prototype.init_connection = function ( )
{   // here connects with mongoose.
    let uri = `mongodb://${this.host}:${this.port}/${this.db_name}`
    console.log ( "connection with uri: " + uri )
    mongoose.connect ( uri )
}


trd_pltfrm_db.prototype.save_trade = function ( trade )
{
    let trade_1  =  new trade_model ( trade )
    trade_1.save ( )
}

trd_pltfrm_db.prototype.read_trades_by_name = async function ( field_name , value )
{
    let search    = {}; search[field_name] = value
    console.log ( search )
    let trades =  await trade_model.find ( search )
    return trades
}

trd_pltfrm_db.prototype.search = async function ( key_val_arr )
{
    let search    = {}; search[field_name] = value
    console.log ( search )
    let trades =  await trade_model.find ( search )
    return trades
}


trd_pltfrm_db.prototype.save_report = function ( trade_report )
{

}

trd_pltfrm_db.prototype.read_report_by_name = function ( trade_report )
{

}
async function run ( search ){
let trd_pltfrm_db_  =  new trd_pltfrm_db ( '127.0.0.1', 27017 , "test_1")
/*
let trade = new trade_t ()
trade.set_open_price ( 1.13 )
trade.set_close_price    ( 1.19 )
trade.set_symbol ( "eurusd" )
trade.set_name   ( "macd_1")
trd_pltfrm_db_.save_trade ( trade )
*/
//let trades = await trd_pltfrm_db_.read_trades_by_name ( "name","macd_1" )
let trades =  await trade_model.find ( search )

//console.log ( trades )
  for ( let a = 0; a < trades.length; a++ ) {
        trd = trades[a]
        console.log ( trd.name , trd.symbol , trd.open_price , trd.close_price )
  }

}

function get_search()
{
    this.ret_obj = {}
}
get_search.prototype.add_obj = function (key,val)
{
    this.ret_obj [key]=val
}
let g_s = new get_search ()
g_s.add_obj ("open_price","1.3171")
g_s.add_obj ("symbol","eurusd")
let k_v = g_s.ret_obj
//console.log ( k_v )
run ( k_v )


// practise with bulk data insertion.
// sorting method , and generic query object which get translated.
// or implement query object interface for each database.
// so translation is simple.
// save_obj ( "object_name" ,  object_ins )
// e.g. object_name should map to some model.
// class mongodb implement  db_interface
//       save_object ( "obj_name", object )
//       query       ( query_obj )
//
