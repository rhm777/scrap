// bind practise.
var person =  {
    first_name: "rh",
    last_name : "br",
    say: function ( )
    {
        console.log ( "name: " + this.first_name + " , last_name: " + this.last_name );    
    }
};
function new_say ( address , address_2  )
{
    console.log ( "address: " + address + " address_2: " + address_2 );
    this.say();
}
//new_say.apply ( person , ["street 1"  , "karachi"]);
let new_say_2  = new_say.bind ( person, "123 street" , "karachi" );
new_say_2( );
//person.say();
//let f = person.say.bind ( person ); // create new function f. with this instance. internal this is 
// needed.
//setTimeout ( f , 1000 );


function pltfrm  ( host , port  )
{   
    this.host  =  host ;
    this.port  =  port ;
    // has trade_lst_t.
}
pltfrm.prototype.print  = function ( )
{
    console.log ( " host: " + this.host + " --- port: " + this.port );
}

pltfrm.prototype.run  =  function ()
{

}

function opt_pltfrm ( host , port )
{

}