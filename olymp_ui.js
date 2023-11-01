let dur_obj  =  require ( "./dur_obj");
let {get_selected_option, get_ele_property, get_string_to_dur_obj} =  require  ("./common_lib.js");

let show_trades_panel         = async function  ( page )
{
    await close_trades_panel ( page )
    await page.waitForSelector('.sidebar-menu-vertical__item:nth-child(2) > .sidebar-menu-vertical__button > .sidebar-menu-vertical__icon > .SvgIcon-module-host-3SE > path')
    await page.click('.sidebar-menu-vertical__item:nth-child(2) > .sidebar-menu-vertical__button > .sidebar-menu-vertical__icon > .SvgIcon-module-host-3SE > path')
}
let close_trades_panel         = async function  ( page )
{
    try{
         //await page.click('.cor-w-panel__container > .cor-w-panel-l-header > .cor-w-panel-c-header > .ButtonBase-module-host-JjJ > .SvgIcon-module-host-3SE:nth-child(1)')
         let sel = "button.ButtonBase-module-host-JjJ[data-test='cor-w-panel-close']"
         let ele = await page.$(sel)
         await ele.click()
    }catch ( err )
    {
        console.log (" **********err occured: " + err.message )
    }
}
let show_closed_trades = async function  ( page )
{
   // await show_trades_panel ( page );
   // await page.waitForSelector('.trading-tabulator > .trading-tabulator__tabs > .trading-tabulator__tabs-wrapper > .ButtonBase-module-host-JjJ:nth-child(2) > span')
   // await page.click('.trading-tabulator > .trading-tabulator__tabs > .trading-tabulator__tabs-wrapper > .ButtonBase-module-host-JjJ:nth-child(2) > span')
    let try_cnt = 0;
    while ( try_cnt <= 1 )
    {
    let sel = "//*[text()='Closed']"
        try{
        await page.waitForXPath ( sel );
        let ele = await page.$x ( sel );
        await ele[0].click(); break;
        }catch(err ){ try_cnt++ ; close_trades_panel(); show_trades_panel(); continue;}   
    }
}
let close_assets_panel  = async function  ( page )
{
    let sel = ".cor-w-panel-c-header__center > .cor-w-panel-l-header__center > .cor-w-panel-l-header__actions > ._1L0VNFDz > .SvgIcon-module-host-3SE";
    try { 
            await page.click(sel)
    } catch ( err )
    {
        console.log ( "[close_assets_panel] .... was not active: " + err.message );
    }
}

let show_assets_panel = async function  ( page )
{
    let sel_asset  = "div.asset-button__title";
    await page.waitForSelector ( sel_asset );
    await page.click ( sel_asset );
}

let switch_symbol  = async function     ( page ,symbol , to )
{
    symbol = symbol.toLowerCase();
    if ( to == undefined ) to = 0;
    await close_assets_panel ( page );
    await show_assets_panel  ( page );
   // await page.waitForTimeout ( 1000 );
    let all_symbols = ".asset-menu__list > .Scroll-module-host-opF  > .asset-item > .asset-item__title-block > .asset-item__title";
     let all_symbols_ele  = await page.$$ ( all_symbols );
     console.log ( "length: " + all_symbols_ele.length );
     for ( let a = 0;  a < (await all_symbols_ele).length; a++ )
     {
         let ele = all_symbols_ele[a];
         let text = await (await ele.getProperty("textContent")).jsonValue();
         console.log ( " i = " + a + " -- " + text + " -- req: " + symbol );
         if ( text.toLowerCase().includes ( symbol ) ) 
         {
            try{
              console.log ( "symbol found.." + symbol  );
              await ele.click();
              await page.waitForTimeout(to);
              return true;
            }catch ( err ) { console.log ( "error occured: " + err.message ); }
        }
     }
     await close_assets_panel ( page );
     console.log ( "symbol not found.." + symbol  );
     return false;
}

let switch_symbol_w_new_page  = async function     ( page ,symbol , to )
{
    symbol = symbol.toLowerCase();
    if ( to == undefined ) to = 0;
    await close_assets_panel ( page );
    await show_assets_panel  ( page );
   // await page.waitForTimeout ( 1000 );
    let all_symbols = ".asset-menu__list > .Scroll-module-host-opF  > .asset-item > .asset-item__title-block > .asset-item__title";
     let all_symbols_ele  = await page.$$ ( all_symbols );
     console.log ( "length: " + all_symbols_ele.length );
     for ( let a = 0;  a < (await all_symbols_ele).length; a++ )
     {
         let ele = all_symbols_ele[a];
         let text = await (await ele.getProperty("textContent")).jsonValue();
         console.log ( " i = " + a + " -- " + text + " -- req: " + symbol );
         if ( text.toLowerCase().includes ( symbol ) ) 
         {
            try{
              console.log ( "symbol found.." + symbol  );
              await ele.click ( );
              //await page.waitForTimeout(to);
              console.log ( "returning ... " );
              break;
            }catch ( err ) { console.log ( "error occured: " + err.message ); }
        }
     }
     await close_assets_panel ( page );
     console.log ( "symbol not found.." + symbol  );
     return false;
}

function change_zoom_level ( page , select_sel , input_tm_str )
{
    this.page         = page;
    this.select_sel = select_sel;
    this.input_tm_str     = input_tm_str;
    
}
change_zoom_level.prototype.verify_input = function ( input_tm_str )
{
    return true;
}
change_zoom_level.prototype.print = function ( input_tm_str )
{
    console.log ( " --- input_tm_str: " + this.input_tm_str );

    return true;
}
change_zoom_level.prototype.get_selected_index = async function ()
{
    let select_ele = await page.$( select_sel )
    let options_ele  = await select_ele.$$("option")
    let selected_index = await get_ele_property ( select_ele , "selectedIndex")
    return selected_index;
    //return await ( await this.select_ele.getProperty("selectedIndex")).jsonValue();

}

change_zoom_level.prototype.do_right_shift     = async function ()
{
    await this.page.waitForSelector('.chart-bottom > .zoom-controls > .btn-to-right > .SvgIcon-module-host-3SE > path')
    await this.page.click('.chart-bottom > .zoom-controls > .btn-to-right > .SvgIcon-module-host-3SE > path')
}

change_zoom_level.prototype.get_selected_option = async function ( select_sel )
{
    let page       = this.page;
    await page.waitForSelector ( select_sel );
    let select_ele = await page.$( select_sel );
    let options_ele  = await select_ele.$$("option");
    let selected_index = await get_ele_property ( select_ele , "selectedIndex")
    let opt_ele = await options_ele[selected_index];
    let value   = await get_ele_property ( opt_ele, "value");
    let text    = await get_ele_property ( opt_ele, "text");
    return { text: text , value: value };
}

change_zoom_level.prototype.zoom_out = async function ( to )
{
    let page  = this.page;
    if ( to == undefined ) to = 0;
    try{
    await page.waitForSelector('.chart-bottom > .zoom-controls > .zoom-controls-wrapper > .btn-minus > .SvgIcon-module-host-3SE')
    await page.click('.chart-bottom > .zoom-controls > .zoom-controls-wrapper > .btn-minus > .SvgIcon-module-host-3SE')
    await page.waitForTimeout ( to );
    }catch ( err ){
        console.log ( " to: " +to + " ---- " + err.message );
    }
}
change_zoom_level.prototype.zoom_in = async function ( to )
{
    let page = this.page;
    if ( to == undefined ) to = 0;
    try{
    await page.waitForSelector('.chart-bottom > .zoom-controls > .zoom-controls-wrapper > .btn-plus > .SvgIcon-module-host-3SE')
    await page.click('.chart-bottom > .zoom-controls > .zoom-controls-wrapper > .btn-plus > .SvgIcon-module-host-3SE')
    }catch ( err )
    {
        console.log ( " to: " +to + " ---- " + err.message ); 
    }
}


change_zoom_level.prototype.do_zoom_out = async function ( to_per_zoom )
{   // match watch was complete and it was near or less than.
    let page = this.page;
    if ( to_per_zoom == undefined ) to_per_zoom = 3000;
    let dur_obj_req         =  new dur_obj ( this.input_tm_str );
    let opt_curr  =  await this.get_selected_option ( this.select_sel );
    let curr_obj      =  new dur_obj ( opt_curr.text );
    let dist     =  dur_obj_req.get_time_distance ( curr_obj );
    let cmp_res = -10;    let match_cnt = 0;
    while  (   true && match_cnt <= 3   ){
        let prev_dist  = dist;    
        await this.zoom_out ( to_per_zoom  );
        let opt  =  await this.get_selected_option (  this.select_sel );
        console.log ( opt );
        let curr_obj_req      =  new dur_obj ( opt.text );
        console.log ( dur_obj_req  );
        console.log ( curr_obj_req );
        dist   =   dur_obj_req.get_time_distance ( curr_obj_req ); // what is dst.now.
        cmp_res  = dur_obj_req.compare_to ( curr_obj_req );
        console.log ( "--- cmp_res: " + cmp_res );
        console.log ( " --- "); console.log ( " --- " );
        console.log ( " ************************** " + cmp_res + " -- prev_dist: " + prev_dist + " -- curr_dist:  " + dist );
            
        if ( cmp_res <= 0 )
        {
            console.log ( " ************************** " + cmp_res + " -- prev_dist: " + prev_dist + " -- curr_dist:  " + dist );
            if ( cmp_res <  0 )
            {
                if ( dist != null &&  Math.abs( prev_dist ) < Math.abs(dist) )
                    await this.zoom_in ( 3000 );
            }
            break;
        }
        if ( prev_dist == dist && prev_dist != null && dist != null)
            match_cnt++;
        else 
            match_cnt = 0;
        console.log( " match_cnt: " + match_cnt )
    }
}

change_zoom_level.prototype.do_zoom_in = async function (  to_per_zoom )
{   // match watch was complete and it was near or less than.
    let page = this.page;
    if ( to_per_zoom == undefined ) to_per_zoom = 3000;
    let dur_obj_req         =  new dur_obj ( this.input_tm_str );
    let opt_curr  =  await this.get_selected_option ( this.select_sel );
    let curr_obj      =  new dur_obj ( opt_curr.text );
    let dist     =  dur_obj_req.get_time_distance ( curr_obj );
    let cmp_res = -10;   
    let match_cnt = 0; 
    while  (   true  && match_cnt <= 3  ){
        let prev_dist  = dist;    
        await this.zoom_in ( to_per_zoom  );
        let opt  =  await this.get_selected_option ( this.select_sel );
        console.log ( opt );
        let curr_obj_req      =  new dur_obj ( opt.text );
        console.log ( dur_obj_req  );
        console.log ( curr_obj_req );
        dist   =   dur_obj_req.get_time_distance ( curr_obj_req ); // what is dst.now.
        cmp_res  = dur_obj_req.compare_to ( curr_obj_req );
        console.log ( "--- cmp_res: " + cmp_res );
        console.log ( " --- "); console.log ( " --- " );
        console.log ( " ************************** " + cmp_res + " -- prev_dist: " + prev_dist + " -- curr_dist:  " + dist );
            
        if ( cmp_res >= 0 )
        {
            console.log ( " ************************** " + cmp_res + " -- prev_dist: " + prev_dist + " -- curr_dist:  " + dist );
            if ( cmp_res >  0 )
            {
                if ( dist != null &&  Math.abs( prev_dist ) < Math.abs(dist) )
                    await this.zoom_out (page , 3000 );
            }
            break;
        }
        if ( prev_dist == dist && prev_dist != null && dist != null)
            match_cnt++;
        else 
            match_cnt = 0;
        console.log( " match_cnt: " + match_cnt )
    }
}

change_zoom_level.prototype.run  = async function ( )
{
    if ( this.input_tm_str == "" )
        return ;
    if ( this.verify_input ( this.input_tm_str ) == false )
        throw new error ("input format is not correct: " + this.input_tm_str );
    let pg  =  this.page;
    let value_arr  =  [];
    while ( true )
    {
        await pg.waitForSelector ( this.select_sel  );
        let select_ele = await pg.$(this.select_sel ); 
        this.select_ele  = select_ele;
        console.log ( "selected index: " + await get_ele_property ( select_ele , "selectedIndex") );
        let options_ele  = await select_ele.$$("option"); // get all options.
        let opt_length   = await (await options_ele).length; // how many options.
        console.log ( " the length: " + opt_length );
        let  req_dur_obj = new dur_obj (this.input_tm_str);
        let  cmp_res = -10; let found_i = -10;
        for ( i = 0; i < opt_length; i++ ) 
        { // find one lesser option than required.
             let opt_ele = options_ele[i];
             let text    = await get_ele_property ( opt_ele, "text");
             let value   = await get_ele_property ( opt_ele, "value");
             value_arr.push ({index:i , text: text, value:value});
             let curr_dur_obj = new dur_obj ( text );
             cmp_res = req_dur_obj.compare_to ( curr_dur_obj );
             console.log ( "i: " + i + " cmp_res: " + cmp_res + " --- text: " + text + " --- value: " + value );
             if ( cmp_res <= 0 )
                    break;       
        }
        console.log ( cmp_res + " --- "  + i )
            if ( cmp_res == 1 )  // no option is found.
            {
                found_i = opt_length-1; 
                cmp_res = -1;   // this will take it to the second matching condition.
                
            }
            if ( cmp_res == -1 )
                {
                    found_i = opt_length -1;
                    cmp_res = -1;
                }
    
        if ( cmp_res == 0 ) 
            {
                found_i = i;   // exact found. switch to it and return.
                let value_i  =  value_arr[found_i].value;
                await this.page.select ( this.select_sel , value_i.toString() );
                return;
            }
        else if ( cmp_res < 0 ) // one less found. from 0 to n-1.
            {
                found_i = (i-1); 
                console.log ( "" );
                console.log ( "" );
                console.log ( " ********** case when cmp_res < 0 i = " + i + " --- found_i: " + found_i );
                if ( found_i == -1 ) // special case when zoom_in is
                {    // called till value is found or more decrement pssble.                  
                    found_i = 0;
                    let value_i  =  value_arr[found_i].value;
                    await this.page.waitForSelector ( this.select_sel );
                    await this.page.select ( this.select_sel , value_i.toString() );
                    await this.do_zoom_in ( 3000 );
                    console.log (" return from zoom_in ");
                }
                else{  // zoom_out is call till fnd or nomore incrm pssble.
                    let value_i  =  value_arr[found_i].value;
                    await this.page.select ( this.select_sel , value_i.toString() );
                    await this.do_zoom_out ( 3000 );
                }  
            }
        
        console.log ( " all selections are completed ... doing right shift ... ");
        await this.do_right_shift ( );
        break;
    } // while loop.
}


module.exports =  { change_zoom_level, switch_symbol , close_assets_panel , show_assets_panel ,show_trades_panel , close_trades_panel, show_closed_trades, switch_symbol_w_new_page } 

