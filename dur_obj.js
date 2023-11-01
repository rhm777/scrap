
function dur_obj ( str )
{
    this.str = str;
    let arr  =  str.split(' ');
    this.obj    =  { tm: arr[0], tm_unit:arr[1]}
}
dur_obj.prototype.toString = function ( )
{
    return " time: " + this.obj.tm  + " unit: " + this.obj.tm_unit ;
}
dur_obj.prototype.units_compare =  function  ( key_1 , key_2 )
{   
    let unit_map   = { sec: 1, secs:1 , min:2,mins:2, hour:3,hours:3 , day: 4,days:4,month:5,months:5}
    let val_1 = unit_map[key_1]; 
    let val_2 = unit_map[key_2];
    
    if (  parseInt(val_1) > parseInt(val_2) )
        return 1;
    else if (  parseInt(val_1) < parseInt(val_2) )
        return -1;
    else
        return  0;     
}

dur_obj.prototype.compare_to = function ( dur_obj_oth )
{
    let key = this.get_time_unit();
    let key_oth = dur_obj_oth.get_time_unit ();
    let value = this.get_time();
    let value_oth = dur_obj_oth.get_time();
    let cmp_res =  this.units_compare ( key , key_oth );
    if ( cmp_res == 1 )
         return 1;
    else if ( cmp_res == -1 )
         return -1;
    else{  // units are equal.
         if ( parseInt(value) > parseInt(value_oth) )
              return 1;
         else if ( parseInt(value) < parseInt(value_oth) )
              return -1;
         else
              return 0;   
    }
}

dur_obj.prototype.get_time = function ( )
{
    return parseInt ( this.obj.tm );
}
dur_obj.prototype.get_time_unit = function  ( )
{
    if ( this.obj.tm_unit.charAt(this.obj.tm_unit.length-1) == 's' )
        return this.obj.tm_unit.slice(0, this.obj.tm_unit.length-1);
    
    return this.obj.tm_unit;
}

dur_obj.prototype.get_time_distance = function ( obj_req )
{
    if ( this.get_time_unit() == obj_req.get_time_unit() )
        return (parseInt ( this.get_time() ) - parseInt ( obj_req.get_time() ));
    return null;
}

dur_obj.prototype.is_tm_greater_than = function ( oth )
{
    return this.get_time() > oth.get_time();
}
dur_obj.prototype.is_tm_less_than = function ( oth )
{
    return this.get_time() < oth.get_time();
}

module.exports = dur_obj;

