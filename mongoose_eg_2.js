

const mongoose  =  require ( "mongoose")

var uri   =  "mongodb://localhost:27017/opt_1"

mongoose.connect ( uri , {useUnifiedTopology:true , useNewUrlParser:true })

const connection  =  mongoose.connection

connection.once ( "open" , function (){console.log ( "[mongoose]connected with opt successfully...")})

var db =  mongoose.connection

var trades_schema   =  new mongoose.Schema({
    name:{type:String},
    tm:{type:String}
})

const trades_model = mongoose.model ( "Trde", trades_schema )
function get_trade ( name , tm )
{
    let ret_obj =  new trades_model()
    ret_obj.name = name
    ret_obj.tm   = tm
    return ret_obj
}
async function save_trade ( trade ){
    trade.save()
}
async function work ( )
{
    let r = await trades_model.find({})
    let i = 0; for ( let b in r )
    {   a = r[i]; i++;
        console.log ( "%s --- %s" , a.name , a.tm  )
    }    
}
work()
//save_trade ( get_trade ( "atrade_2","tm_2" ) )
//save_trade ( get_trade ( "atrade_1","tm_2" ) )

//mongoose.disconnect()