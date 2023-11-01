



const mongoose  =   require ( "mongoose" )



/*
async function main (){
    let student_schema  =  new mongoose.Schema ( {
        name: { type:String },
        age:  { type:String },
        courses: [{type:Number}]
    })
    await mongoose.connect ("mongodb://localhost:27017/opt_10" )
let student_model = await mongoose.model( "student_1", student_schema )

let st_1 = { name:"rah" , age:13, courses:[1,2,3,4]}
let  ins  = new student_model ( st_1 ) 
await ins.save( st_1 )
} */
/*
async function main (){
    let product_schema  =  new mongoose.Schema ( {
        key:   { type:Number },
        cnstv_wins:  {values:mongoose.Schema.Types.Mixed},
        cnstv_loss:  { values:mongoose.Schema.Types.Mixed} 
    })
    await mongoose.connect ("mongodb://localhost:27017/opt_10" )
let product_model = await mongoose.model( "product_6", product_schema )
let mp = new Map()
nos = []; nos.push ( 1 ); nos.push (77); nos.push ( 100)

mp.set (  { key:"Hello",nos:nos} )
let st_1 = { key:1234 , cnstv_wins:{values:nos} , cnstv_loss:{values:nos}}
let  ins  = new product_model ( st_1 ) 
await ins.save(  )
} 
main()*/


// key to value for field content.
/*
async function main (){
    let product_schema  =  new mongoose.Schema ( {
        key:   { type:Number },
        cnstv_wins:  [mongoose.Schema.Types.Mixed]
        
    })
    await mongoose.connect ("mongodb://localhost:27017/opt_10" )
let product_model = await mongoose.model( "product_8", product_schema )
let mp = new Map()
nos = []; nos.push ( 1 ); nos.push (77); nos.push ( 100)

mp.set (  { key:"Hello",nos:nos} )

let st_1 = { key:1234 , cnstv_wins:nos }
let  ins  = new product_model ( st_1 ) 
await ins.save(  )
} 
main()
*/
// key to value for field content.
let hp  = new Map()
hp.set ( "1", 7 )
hp.set ( "2", 4 )
hp.set ( "3", 2 )
hp.set ( "7" ,4 )

async function main (){
    let product_schema  =  new mongoose.Schema ( {
        key:   { type:Number },
        cnstv_wins: Map
        
    })
    await mongoose.connect ("mongodb://localhost:27017/opt_10" )
let product_model = await mongoose.model( "product_10", product_schema )

let st_1 = { key:1234 , cnstv_wins:hp }
let  ins  = new product_model ( st_1 ) 
await ins.save(  )
} 
main()