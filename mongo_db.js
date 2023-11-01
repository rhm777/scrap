
const mongoose   =  require ( "mongoose"  )
const make_query = require ( "./make_query")
const clb        = require ("./common_lib")
//const MongoClient = require ( "mongodb" )
const trade_t       = require ("./trade_t")

function mongo_db ( host , port , db_name )
{
    this.host = host
    this.port = port
    this.db_name = db_name
    this.models      =  []
    this.models_ins  =  []
    this.initialize()
}
//name_ , model_class , schema_def
/*mongo_db.prototype.add_schemas  =  function ( schema_map )
{
    for ( let [ key, schema_def ] of schema_map.entries() )
    {
        let schema = new mongoose.Schema ( schema_def   )
        let model  = mongoose.model      ( key , schema )
        this.models[key]      =  model   
        this.models_ins[key]  =  new model()  
    }
}*/
mongo_db.prototype.add_schema  =  function ( name , schema_def )
{
    //let schema = new mongoose.Schema ( schema_def   )
    let model  = mongoose.model      ( name , schema_def )
    this.models[name]      =  model   
    this.models_ins[name]  =  new model()  
}

mongo_db.prototype.initialize  =  async function ( )
{
    this.uri =  `mongodb://${this.host}:${this.port}/${this.db_name}`
    await this.connect ( )
  //  this.mongo_client = new MongoClient (this.uri )
}

mongo_db.prototype.connect  = async function ( )
{
    mongoose.connect ( this.uri )
}

mongo_db.prototype.save_obj  =  function ( name , obj )
{
    /*let model_obj = this.models_ins[name]    // instance of name:trade
    model_obj = Object.assign ( new this.models[name]  , obj )
    console.log ( model_obj )
    model_obj.save (  )   
    console.log ( "---record for " + name + " is written...")
    */
    let  model_name    =  this.models [ name ]
    let  model_ins     =  new model_name ( obj )

    //let  obj_ins       =  Object.assign (  new this.models[name] , obj )
    console.log ( " pre-saved: " + model_ins.report_name )
    model_ins.save ()
    console.log ( " saved: " + model_ins.report_name )
   // Object.assign ( obj_ins , {} )
   // console.log ( " saved " + obj_ins.report_name )
}

mongo_db.prototype.remove_obj  =  function ( name , obj )
{
    let model = this.models[name]    // instance of name:trade
    model.deleteMany({}, function (){})
    console.log ( "---delete all records for " + name + " count: "  )
}

mongo_db.prototype.find       =  async function ( name , query_obj, limit_ )
{

    let trade_obj = this.models[name]
    let objs = await trade_obj.find ( query_obj.get_query ).sort ( query_obj.get_sort_fields ).limit ( limit_ )
    return objs
}
mongo_db.prototype.find_obj       =  async function ( name, qry_str , sort_fields = "{}" , display_fields = {_id:false , __v:false } , limit_ = 20 )
{
      let db_query = ""
      let table_obj   = this.models[name]
      if ( qry_str=="" ) { 
        db_query  = JSON.parse ( "{}" )
      }
      else {
      
      let make_query_ = new make_query ( qry_str )
      make_query_.parse ( )
      db_query  = JSON.parse ( make_query_.query_str ) 
      }
      let objs = await table_obj.find ( db_query, display_fields ).sort ( sort_fields ) //.limit ( limit_ )   
      return objs
      //objs.forEach ( (ele) => console.log ( ele.symbol + " -- " + ele.name + " -- " + "--" + ele.dir_str + "--"  + ele.close_price + "---" + ele.open_price ))
    //return await trade_obj.find ( query_obj.get_query ).sort ( query_obj.get_sort_fields ).limit ( limit_ )
    
}

mongo_db.prototype.disconnect =  async function ( )
{
    mongoose.disconnect()
}
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
function insert_records ( ins , count )
{
    for  ( let i = 0; i < count; i++ )
        {
            let trd_0   =   make_new_trade ( )
            ins.save_obj ( "trade" , trd_0 )
            console.log ( "i = " + i + " record written... ")    
        }
    console.log( "completed:" + count )
}
//console.log(  "gbpjpys".includes("x"))

//let trd_0 = make_new_trade ( )
//console.log ( trd_0 )
//clb.random_range ( 100 , 200 )
//console.log ( new trade_t().get_schema_def () )
//console.log ( make_new_trade () )
/*
let mongo_db_ins = new mongo_db ( '127.0.0.1', 27017 , "opt_7")
mongo_db_ins.add_schema ( "trade", new trade_t().get_schema_def() )
//mongo_db_ins.remove_obj ( "trade"       )
insert_records ( mongo_db_ins,101 )
*/
//console.log ( "completed....")
//mongo_db_ins.save_obj ( "trade" , trd_0 )
//mongo_db_ins.find_obj ( "trade" , "symbol = gbpusd",{symbol:1,name:1,dir_str:1,close_price:1,open_price:1},{_id:false,symbol:true,dir_str:true,name:true,close_price:true, open_price:true})

module.exports = mongo_db


//let qry_str    = "symbol = eurusd "
//let make_query_ = new make_query ( qry_str )
//make_query_.parse ( )
//console.log ( make_query_.query_str )


//mongo_db_.disconnect( )

/*
let trade = new trade_t ()
trade.set_open_price ( Math.random() * 100 )
trade.set_close_price    ( Math.random() * 100 )
trade.set_symbol ( "usdjpy" )
trade.set_name   ( "macd_1")
mongo_db_.save_obj ( "trade" , trade )
*/
