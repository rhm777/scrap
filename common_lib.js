
// library functions.
async function get_selected_option ( page , select_sel )
{
    let select_ele = await page.$(select_sel);
    let options_ele  = await select_ele.$$("option");
    let selected_index = await get_ele_property ( select_ele , "selectedIndex")
    let opt_ele = await options_ele[selected_index];
    let value   = await get_ele_property ( opt_ele, "value");
    let text    = await get_ele_property ( opt_ele, "text");
    return { text: text , value: value };
}
async function get_ele_property ( ele_handle , prop_name )
{
    return await ( await ele_handle.getProperty(prop_name)).jsonValue();
}
async function get_string_to_dur_obj ( str )
{
    let arr  =  str.split(' ');
    let ret_val = { tm: arr[0], tm_unit:arr[1]}
    return ret_val;
}
function sleep ( ms )   // async function.
{
    return new Promise ( (resolve,err)=>
        setTimeout ( resolve, ms )
    )
    
}
Date.prototype.get_copy  = function ( )
{
    return new Date ( this.getTime() );
}
Date.prototype.add_hours = function ( no_of_hours )
{
    let to_add = no_of_hours * 60*60*1000;
    let milli_secs =  this.getTime() + to_add;
    this.setTime ( milli_secs );
}
Date.prototype.add_mins = function ( no_of_mins )
{
    let to_add = no_of_mins *60*1000;
    let milli_secs =  this.getTime() + to_add;
    this.setTime ( milli_secs );
}
Date.prototype.add_days = function ( no_of_days )
{
    let to_add = no_of_days * 24 * 60*60*1000;
    let milli_secs =  this.getTime() + to_add;
    this.setTime ( milli_secs );
}
function extract_double ( str )
{
    return parseFloat(str.replace (/[^.\-0-9]/g,''))
}
function string_includes ( str_0 , str_1 )
{
    if ( str_0.length > str_1.length )
        return str_0.toLowerCase().includes ( str_1.toLowerCase() )
    else
        return str_1.toLowerCase().includes ( str_0.toLowerCase() )
}

function isAlpha ( str )
{
    var code, i, len;
    if ( typeof( str ) == 'number')
        return false
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)
         ) { 
        return false;
      }
    }
    return true;
}
function isNumeric ( str )
{
   // console.log ( str.charCodeAt(0))
   let dot_count = 0 
   for (i = 0;  i < str.length; i++ ) {
        code = str.charCodeAt(i);
        if ( i == 0 &&  (!(code > 47 && code < 58) && code != 46)  )
           return false
        if ( code == 46 )
        {
            dot_count++; 
            if ( dot_count > 1 ) return false
        }
    }  
    return true
}

function isAlphaNumeric ( str )
{   // if first character is non alpha.
    var code, i, len;
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if ( i == 0 && !(code > 64 && code < 91)&&!(code > 96 && code < 123) )
         return false
      if ( i > 0 ){
        if ((code > 64 && code < 91) || // upper alpha (A-Z)
            (code > 96 && code < 123)
            ) { 
            return true;
        }
      }
    }
    return true
}
random_range = function ( from , to ) 
{
    let rand_no  =  Math.floor(from + ( Math.random() * (to-from) ))
    //console.log ( rand_no )
    return rand_no
}

function number_range ( from, to )
{  
    this.from = from
    this.to   = to
}
number_range.prototype.get_length = function ( )
{
    return to-from
}
number_range.prototype.in_range = function ( no )
{
    if ( no >= to && no < from )
        return true
    return from
}
function make_tz_date ( ts , tz_str,  hour24 = true )
{  
    let given_date   =  new Date ( ts )
    let tmzone       =  tz_str
    let remote_date_str = given_date.toLocaleString ( 'en-US', { timeZone:tmzone  } )
    return new Date ( remote_date_str )
}
let common_lib = { make_tz_date:make_tz_date,random_range:random_range ,isNumeric:isNumeric,isAlpha:isAlpha,isAlphaNumeric:isAlphaNumeric, string_includes:string_includes, extract_double:extract_double, sleep: sleep, get_ele_property:get_ele_property , get_selected_option: get_selected_option};
//module.exports = { get_selected_option, get_ele_property, get_string_to_dur_obj, common_lib }
module.exports  =  common_lib


// e.g. of calling sleep.
/*
sleep(10000).then ( ()=>console.log("completed"));
async function r (){
await sleep ( 7000 );
console.log ( "comp");
}*/