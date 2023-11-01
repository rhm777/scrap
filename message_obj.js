


//type:[opt/fxx]   role:[sender,receiver] cntx:[stratedgy_name or logical grouping of receivers ]

function message_obj (  )
{
  //console.log ( "instance created");
}
message_obj.prototype.new_empty_object = function ( )
{
  return new Object()
}
message_obj.prototype.new_object = function  ( obj_name , obj_val )
{
    //let ret_obj = { obj_name : obj_val } 
    let ret_obj = new Object();
    ret_obj[obj_name] = obj_val;
    return ret_obj;
}
message_obj.prototype.print = function ( ins )
{
   
}

module.exports  =  message_obj