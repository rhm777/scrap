
// is given units are less than?
async function tm_units_compare ( tm_1 , key_1 , tm_2 , key_2 )
{   // this is used for comparing to tm_units for greater or less.
    // hour is greater than min. 
    //let unit_arr   = [ "sec","min","hour","day","month"];
    let unit_map   = { sec: 1, secs:1 , min:2,mins:2, hour:3,hours:3 , day: 4,days:4,month:5,months:5}
    let val_1 = unit_map[key_1]; 
    let val_2 = unit_map[key_2];
    //console.log ( val_1 + " -- " + val_2 );
    if ( tm_1 < tm_2 && val_1 <= val_2 )
        return true;
    return false;
}
// find the index which is one greater than do
// zoom_in which is minus.
// given values which should be correct. 
// is compared with array values.
// once index is obtained. do zoom_in until
// value is obtained or zoom becomes less than , than do zoom_in or it is no more less than.
async function run()
{

    console.log ( " --- " + await tm_units_compare ( "hour","min") );


}
run();