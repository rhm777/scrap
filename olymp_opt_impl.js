/*  today: 
           may 20: think out the strategy_reporting ... using mongoose etc.
           may 21-june 21 web tools and this implementation.
           june 21 - jul 10 extend site
           july 10-aug 10  ml. aug 10-aug 30 mql5.
*/
/*
    today: may 21: 1:00p.m-5.00p.m.
        check if symbol, amount and duration is already correct. to save time.
        logging of trades for verification.
        next steps required for progress.
        e.g. webdevelopment with nodejs.
        reporting etc with mongoose.
        class for reporting etc. 
        find clothing for exercise.

*/

const  {change_zoom_level,switch_symbol, close_assets_panel,show_assets_panel, show_trades_panel , close_trades_panel,show_closed_trades,switch_symbol_w_new_page} = require ( "./olymp_ui")
const  dur_obj  = require("./dur_obj")
const common_lib = require ( "./common_lib");
const trade_t  =    require ("./trade_t");
const  pup  = require("puppeteer");
const opt_pltfrm  =  require ( "./opt_pltfrm" );
const { duration } = require("moment");

function olymp_opt_impl (  serv_addr , serv_port , name_ , dur_tm_str , max_open_trades )
{
   this.name        =   name_
   this.dur_tm_str  =   dur_tm_str;
   this.max_open_trades = max_open_trades == undefined ? 10 : max_open_trades
   this.opt_pltfrm_  = new opt_pltfrm ( this , serv_addr , serv_port , this.name )
   this.initialize()
   
}

olymp_opt_impl.prototype.print = function ( )
{
    console.log ( "[olymp_opt_impl.print]  dur_tm_str: " + this.dur_tm_str + " -- max_open_trades: " + this.max_open_trades )
}
// followings are ui specific function or helper functions.
olymp_opt_impl.prototype.close_assets_panel   = async function ( page )
{
    await close_assets_panel ( page );
}

olymp_opt_impl.prototype.show_assets_panel   = async function ( page )
{
    await show_assets_panel ( page );
}

olymp_opt_impl.prototype.close_trades_panel   = async function ( page )
{
    await close_trades_panel ( page );
}

olymp_opt_impl.prototype.show_trades_panel   = async function ( page )
{
    await close_trades_panel ( page )
    await show_trades_panel  ( page )
}

olymp_opt_impl.prototype.switch_symbol   = async function ( page , symbol )
{
   await switch_symbol ( page , symbol , 3000 );
}


olymp_opt_impl.prototype.get_trade_amount_str = async function ( amount )
{
    return amount + "";
}
olymp_opt_impl.prototype.set_trade_amount    =  async function ( page ,amount )
{
    //let page = this.page;
    let ele_price_amount   =  await page.$("input[data-test='deal-amount-input']")
    let price_amount_str     =  await common_lib.get_ele_property ( ele_price_amount , "value")
    let price_amount         =  common_lib.extract_double ( price_amount_str )
    console.log ( " !@#$---------current price amount: " + price_amount + " require priceamount:" + amount )
    if ( price_amount  == amount )
    {
        console.log ("-------------> trade amount is already setted:" + amount)
        return false
    }
    let amount_sel = "input[data-test='deal-amount-input']";
    await page.waitForSelector ( amount_sel );
    let amount_str = await this.get_trade_amount_str ( amount );
    await page.click( amount_sel , {clickCount:1});
    await page.keyboard.press('End');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    
    await page.type ( amount_sel , amount_str , {delay:150});
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    //await page.click ( "rect.rectCover")
    await page.click ( "div");

}

olymp_opt_impl.prototype.get_duration_str = async function ( tm_hour , tm_min  )
{   // type must be provided  [ min , hour ]
    let tm_hour_str = tm_hour + "";
    if ( tm_hour < 10 )
         tm_hour_str = "0" + tm_hour_str;
    let tm_min_str = tm_min + "";
    if ( tm_min < 10 )
        tm_min_str = "0"  + tm_min_str;
    let dur_str = tm_hour_str + " " + tm_min_str;
    return dur_str;      
}

olymp_opt_impl.prototype.set_trade_duration    =  async  function ( page , tm_hr , tm_min )
{
    //let page    =    this.page;
    let ele_duration       =  await page.$("input[data-test='deal-duration-input']")
    let duration_str      =  await common_lib.get_ele_property ( ele_duration , "value")
    let duration_arr      =  duration_str.split ( ' ')
    let hours = 0 ;  let mins = 0
    if ( duration_arr.length == 4 ) {hours = duration_arr[0]; mins = duration_arr[2]}
    else { mins = duration_arr[0] }
        
    if ( tm_hr == hours &&tm_min == mins )
        {
            console.log ( "-------------------> trade set hours/mins is already setted: hours:" + hours + " --mins:" + mins )
            return false
        }
    let duration_sel = "input[data-test='deal-duration-input']";
    await page.waitForSelector ( duration_sel );
    let dur_str = await this.get_duration_str ( tm_hr , tm_min );
    console.log ( dur_str );
    await page.click( duration_sel , {clickCount:1});
    await page.keyboard.press('Home');
    await page.type ( duration_sel , dur_str , {delay:150});
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.waitForSelector ("span[data-trans='asset_profitability']")
    await page.click ("span[data-trans='asset_profitability']")
    
    //await page.click ( "rect.rectCover")
    //await page.click ( "div")
}

olymp_opt_impl.prototype.set_trade_symbol    =  async   function ( page , symbol , to )
{   // click some option. then scroll and select the symbol.
    let ele_symb  =  await page.$("div.asset-button__title")
    let curr_symbol    =  await common_lib.get_ele_property ( ele_symb , "textContent")
    console.log ( " ------------------------->current symbol: " + curr_symbol + " --- trade_symbol " + symbol )
    if ( common_lib.string_includes ( curr_symbol , symbol) )
        console.log ( "!@#$--------current symbol is already selected skipping selection ")
    else
        return await switch_symbol      ( page , symbol, to  )
}

olymp_opt_impl.prototype.open_buy_trade   =  async   function ( page  )
{
    //let page = this.page;
    await page.waitForSelector('.deal-buttons > .deal-button_up')
    await page.click( '.deal-buttons > .deal-button_up')
}

olymp_opt_impl.prototype.open_sell_trade   =  async   function ( page  )
{
    //let page = this.page;
    await page.waitForSelector('.deal-buttons > .deal-button_down')
    await page.click( '.deal-buttons > .deal-button_down')
}

olymp_opt_impl.prototype.get_closed_trades_count      =    async function ( page )
{
        let sel = "div.deal-card-header";
        await page.waitForSelector ( sel );
        let ele  =  await page.$$ ( sel );
        return await ele.length;
        console.log ( ele.length );
} 

olymp_opt_impl.prototype.read_deal_card_value      =    async function ( page , sel , field_name )
{
    await page.waitForSelector ( sel );
    let        ele      = await page.$ ( sel );
    let        ele_     = await ele.getProperty("textContent"); //.jsonValue()
    let     ret_val     = await ele_.jsonValue();
    return  ret_val;
}

olymp_opt_impl.prototype.open_tab_for_asset = async function  ( page , asset_name )
{   // returns a page.
    await this.close_assets_panel  ( page )
    //await this.show_assets_panel   ( page )
    await switch_symbol_w_new_page       ( page , asset_name , 3000 );

}

olymp_opt_impl.prototype.set_zoom_level = function ( page , dur_tm_str )
{
    if ( dur_tm_str != undefined && dur_tm_str != "" )
    {   //change chart zooming if required
        //let sel = "div.js-main-chart-container.main-chart-container > div.chart-bottom > div > div > select";
        let sel = "div > div > span > .ButtonBase-module-host-JjJ"
        //let dur_tm_str = "1 hours"
        let change_zm_lvl  = new change_zoom_level ( page , sel,  dur_tm_str );
        change_zm_lvl.run()
       
    }
}

// where trade_id_map are the trades which are completed and by ids.
// the implementation should be for each such id find it. 
// therefore trade_id_arr is given, return is a objs where this ids are found with
// other variable information.
olymp_opt_impl.prototype.ui_read_closed_trades   =    async function ( page , trade_id_map ,  read_cnt , last_trade_id )
{
       page.setDefaultNavigationTimeout(60000)
       if ( read_cnt == undefined )  read_cnt = 20;

       //await close_trades_panel  ( page )
       await show_trades_panel   ( page )
       await page.waitForTimeout  ( 1000 );
       await show_closed_trades  ( page )
       //let ele_cnt = await this.get_closed_trades_count ();
      // console.log  ( ele_cnt );
       // click the first nth-child. using sel.
       let sel_trade_info  =  "div.deal-card-header";
       await page.waitForSelector ( sel_trade_info );
       let trades_info     =  await page.$$ ( sel_trade_info )
       console.log ( trades_info.length );
       // fill trade information as much possible
      // let ret_trds = new Array()
       let count_req = trade_id_map.size; let count_found = 0;
       for ( let i = 0; i < trades_info.length; i++ )  // read browser trades.  
       {    
             if ( i>= read_cnt ) break
             if ( count_found == count_req )
                break;
             await trades_info[i].click();     // expand it.
             console.log ( "rec  i = " + i );
             let trade_id_sel    = "div.deal-card-details > div:nth-child(7) > span.data-value-field__text.data-value-field__text-value > span";
             let trade_id     = await this.read_deal_card_value ( page, trade_id_sel ) 
             console.log ( " --index: "  + i + " ---------- browser trade_id: " + trade_id + " -- last_trade_id: " + last_trade_id )
             if ( last_trade_id != undefined && last_trade_id != 0 && last_trade_id==trade_id )
                    break
             let trade = trade_id_map.get(trade_id) 
             if ( !trade ) continue
              
             // if ( trade  )
            // {
                 trade.set_status ( 3 )
                 count_found++;
            // }
             // loss is actual profit if any.
             // bet or set_price_amount is already given.
             // therefore profit_amount ( loss!=0 ? loss : get_price_amount )
             let profit_sel = "div.deal-card-details > div:nth-child(1) > span.data-value-field__text.data-value-field__text-value.data-value-field__text-value_highlighted > span > span"
             let profit     = await this.read_deal_card_value ( page , profit_sel ) 
             let loss_sel   = "span[data-test='deal-current-card-floating-amount-ftt']"
             let loss       = await this.read_deal_card_value ( page , loss_sel ) 
             loss           = parseFloat(loss.replace (/[^.\-0-9]/g,''))
             profit         = parseFloat(profit.replace (/[^.\-0-9]/g,''))
             //trd.set_profit_amount ( profit )
            // if ( loss == 0.0 )
            //     trade.set_profit_amount ( trade.get_price_amount() )
            // else
                 trade.set_profit_loss_amount ( loss   )

             let open_price_sel = "div.deal-card-details > div:nth-child(5) > span.data-value-field__text.data-value-field__text-value > span > span"
             let open_price     = await this.read_deal_card_value ( page,  open_price_sel ) 
             trade.set_open_price ( open_price )
             let close_price_sel = "div.deal-card-details > div:nth-child(6) > span.data-value-field__text.data-value-field__text-value > span > span"
             let close_price     = await this.read_deal_card_value ( page, close_price_sel ) 
             trade.set_close_price  ( close_price )
             
             
        }
       
       await close_trades_panel  ( page )
}



olymp_opt_impl.prototype.get_open_count = async function ( page )
{
    try{
        let ele = await page.$$("button.sidebar-menu-vertical__button span>span")
        let count  =  await common_lib.get_ele_property (ele,"textContent")
        if ( count == "Trades")
            return 0
        return count 
    }catch( err )
    {
        console.log ("[olymp_imp.open_count]" + err.message )
        return 0
    }
    return 0
}

olymp_opt_impl.prototype.read_new_open_trade   = async function ( page )
{
    console.log ( "[olymp_impl.read_new_open_trade]:reading new open trade...")
    await this.show_trades_panel ( page )
    await page.waitForSelector("span[data-trans='deals_active']")
    await page.click ( "span[data-trans='deals_active']")
    let ret_obj = new Array()
    try{
        await page.waitForSelector ( "div.deal-card-title__main" )
        
    try{
            await page.click("span.collapsible-arrows_opened")
        }catch ( err ){console.log ("[collapsible arrow]:" +  err.message)}
        let eles  =  await page.$$ ( "div.deal-card-title__main" ) // first group.
        await eles[0].click ( )  // expand it. the deal card no 1 for the symbol.
        await page.waitForSelector ( "div[data-test='deal-current-card-ftt'] >div>div>div" )
        try{
            trade_id_eles  = await page.$$("div.data-value-field>span>span") // fields_arr.
            trade_id       = await common_lib.get_ele_property ( trade_id_eles[5],"textContent")
        }catch( err ){  // if failed selection trade ids.   
        let open_trades = await page.$$("div[data-test='deal-current-card-ftt'] >div>div>div")
        await open_trades[0].click("div.data-value-field>span>span") // first trade.
        }
        trade_id_eles  = await page.$$("div.data-value-field>span>span") // fields_arr.
        trade_id       = await common_lib.get_ele_property ( trade_id_eles[5],"textContent")
        let open_tm_ts     = await common_lib.get_ele_property ( trade_id_eles[7],"textContent")
        let tmp_date  = new Date ( open_tm_ts ) 
        tmp_date.setFullYear(new Date().getFullYear())
        open_tm_ts    = tmp_date.getTime()  
        console.log ( trade_id )
        console.log ( open_tm_ts )
        console.log ( tmp_date.toString() )
        ret_obj["trade_id"] = trade_id
        ret_obj["open_time_ts"] = open_tm_ts
        ret_obj["open_time_str"] = tmp_date.toString()
        await eles[0].click() // close the expansion of sub trade list.

        // more fields can be readed via trade_id_eles arr and span.
        //return ret_obj
    }catch ( err )
    {
        console.log ( "[opt_impl.read_new_open_trade] has failed ... " + err.message )
        return false
    }
    await close_trades_panel(page)
    return ret_obj
}
// a tab for opened trades is needed.
olymp_opt_impl.prototype.initialize  = async function( )
{
    const  browser = await pup.launch({ userDataDir: './data',headless:false ,'slowMo':00});
    this.page    = await browser.newPage();
    console.log ( await (await browser.pages()).length );
    this.page_for_new_trades  = await browser.newPage()
    //await page.waitForNavigation();
    await  this.page_for_new_trades.setDefaultNavigationTimeout(110000);
    await  this.page_for_new_trades.goto("https://olymptrade.com", {waitUntil: ['domcontentloaded'], timeout: 60000});
    //let new_page   =   await browser.newPage();
    await this.page_for_new_trades.goto ( "https://olymptrade.com/platform" )
    console.log ( await (await browser.pages()).length );
    await this.close_trades_panel ( this.page_for_new_trades )
    //await this.set_zoom_level ( this.page_for_new_trades , this.dur_tm_str );
    //await this.read_close_trades ( new_page );
}
olymp_opt_impl.prototype.get_profitability = async function ( page )
{
      let ele  =  await page.$("span[data-test='profitability-percent']")
      let profitab  =   await common_lib.get_ele_property ( ele, "textContent")
      
      return common_lib.extract_double ( profitab )
}
olymp_opt_impl.prototype.check_instrument_not_available = async function ( page )
{
    return false
}
olymp_opt_impl.prototype.ui_open_trade  =   async function ( page , trade  )
{ 
    // get_active_open_count() ----- >= return false.
    //let  page  =  this.page_for_new_trades
    try{
    console.log ( "[ui_open_tab] profitablity is " + await this.get_profitability(this.page_for_new_trades))
    
    await this.close_trades_panel ( page )
    await this.close_assets_panel ( page )
    if ( await this.check_instrument_not_available(page) )
    {
        trade.set_error ( true , "symbol: " + trade.get_symbol() + " not available.", "SYMBOL_NOT_AVAILABLE")
        return trade
    }
    let open_count = await this.get_open_count ( page )
    console.log ( "[open_trade returned]...open count: " + open_count + " max-allowed: " + this.max_open_trades )
    
    if ( open_count >= this.max_open_trades) 
    {
        trade.set_error ( true , "open_count:" + open_count + " is > than " + this.max_open_trades, "OPEN_LIMIT_ERROR")
        return trade
    }       

    await this.set_trade_symbol   ( page , trade.get_symbol( ) )
    await this.set_trade_amount   ( page , trade.get_price_amount() )
    await this.set_trade_duration ( page , trade.get_dur_hr() , trade.get_dur_mins() )
   // else { console.log( " skipping duration setting .... of hours: " + hours + "-- " + mins ) }
    //console.log  ( "[] trade_open_received: dir: " + trade.get_duration_str() + " --- " + trade.get_symbol ()  + " -- "  + trade.get_amount() + "--" + trade.get_duration_str());
    if ( trade.get_dir_str () == "buy" )
        await this.open_buy_trade ( page )
    else if ( trade.get_dir_str() == "sell" )
        await this.open_sell_trade ( page );    
    let tmp_obj = await this.read_new_open_trade ( page , trade )
    if ( tmp_obj )
        {
            trade.set_id ( tmp_obj["trade_id"] )
            trade.set_open_time_ts ( tmp_obj["open_time_ts"])
            trade.set_open_time_str ( tmp_obj["open_time_str"])
            let tmp_date = new Date ( tmp_obj["open_time_ts"] )
            tmp_date.add_hours ( trade.get_dur_hr()   )
            tmp_date.add_mins  ( trade.get_dur_mins() )
            trade.set_close_time_ts ( tmp_date.getTime() )
            trade.set_close_time_str ( tmp_date.toString())
               
            trade.set_error ( false , "none" , "none" )
            trade.opt_print()
            return true
        }
    
       return false
    }catch ( err )
    {
        trade.set_error ( true , err.message ,"ui_error")
        return false
    }
    return false
}

olymp_opt_impl.ui_read_close_trades_del  =   async function ( page , trade_arr )
{
    // for each su
}

olymp_opt_impl.prototype.open_trade  =   async function ( trade )
{ 
    return await this.ui_open_trade ( this.page_for_new_trades , trade )
}
olymp_opt_impl.prototype.get_closed_trades_info  =   async function ( trade_arr , read_cnt , last_trade_id )
{ 
    return await this.ui_read_closed_trades ( this.page_for_new_trades , trade_arr, read_cnt , last_trade_id )
}

olymp_opt_impl.prototype.check_fields = async function ( page , trade )
{
    let ele_duraton       =  await page.$("input[data-test='deal-duration-input']")
    let duration_str      =  await get_ele_property ( ele_duration , "value")
    let duration_arr      =  duration_str.split ( ' ')
    let hours = 0 ;  let mins = 0
    if ( duration_arr.length == 4 ) {
            hours = duration_arr[0]; mins = duration_arr[2]
    }
    else { mins = duration_arr[0] }
    console.log ( "symbol: " + symbol + " --- price_amount: " + price_amount )
    console.log ( " duration: hours:" + hours + " mins: " + mins )
    console.log ( "symbol match: " + (symbol.toLowerCase() == trade.get_symbol()) ) 
}

let olymp_opt_impl_  =  new olymp_opt_impl ( '127.0.0.1',7777,"macd_1","1 hours",10)

