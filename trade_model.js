


const mongoose  =   require ( "mongoose" )

const trade_schema =  new mongoose.Schema ({
    name:String,
    open_price  : Number,
    close_price : Number,
    symbol      : String

})

let trade_model = mongoose.model ( "trade" , trade_schema )
module.exports = { trade_model } 