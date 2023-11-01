// connect , define schema, create model_clas_name from schema.
// use queury to find.

const mongoose  =   require ( "mongoose" )

//main().catch ( (err)=>console.log ( err ) )
async function main () {
    mongoose.connect ("mongodb://localhost:27017/opt_4" )
    let trade_schema  =  new mongoose.Schema( {symbol:String,open_price:Number} )
    const Trade    =  mongoose.model ( "Trade" , trade_schema )
    /*
    let trade_1 = new Trade ()
    trade_1.symbol = "gbpchf" 
    trade_1.open_price = 7.4171
    await trade_1.save (  ) 
    */ 
    let trades = await Trade.find().sort({open_price:-1})
    .then ( (trades)=>{
       console.log ( trades.length)
       for ( let i = 0; i < trades.length; i++ )
            console.log ( trades[i].symbol + " _-- " + trades[i].open_price )
    })
//})
}
main()
//console.log ( mongoose.models)
//}

//main()