

const mongoose  =  require ( "mongoose")

var uri   =  "mongodb://localhost:27017/opt"

mongoose.connect ( uri , {useUnifiedTopology:true , useNewUrlParser:true })

const connection  =  mongoose.connection

connection.once ( "open" , function (){console.log ( "[mongoose]connected with opt successfully...")})

let trade = new mongoose.Schema ( {
    trade_id:{type:Number},
    name: {type:String},
    open_price: { type:Number}
}, { collection:"Trades_1"}
)

trades = mongoose.model ( "trades", trade )
trades.insertMany ( [{trade_id:1234, name:"macd_1", open_price:1.2131}])
//let a = trades.find({trade_id:1234}) 
//console.log ( a.name )