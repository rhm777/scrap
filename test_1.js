// create two async functions depending on which page you are.
// then in func2 , do a click.
// workout diagram.
//   there are tabs associated with each page by symbol name.
//   for each command , switch to tab, and carry out that command.
//   then intermittantly create performance in file by symbol.
// implement diagram.
//      read following.
//      networking, threading (if required),
//      file saving.
//      tab switching.
//      associative array.

// fix wine and mql5.
// fix java coding. with libraries in code.
// fix mql5/mql4 networking.

// april - 22.  - april 25. complete first task.
// start computer.  *
// run the previous program successfully.
// implement following tasks:
//    open a single tab.
//    open up a trade.
//    open three symbol tabs.
//    visit each tab successfully.
//    open trade as hidden or by visiting each tab. april 22.
//    implement open trade by trade_obj.
//    implement fill out of time , amount along above.
//    if done passed trade objs from file to check of reentrancy. april 23.
//    implement networking and queue which has wait. april 24.
//    move the project to other folder.
//    implement all api , one by one.  april 25-26-27.
//    goto next level.
// today: april 24:
// find if attribute selector working. *  text selector not available.
// implement xpath click with page access.
// connector using promise. for xpath click.

const pup   =     require ( "puppeteer");
const {get_selected_option,get_ele_property,get_string_to_dur_obj, dur_obj , change_zoom_level_2} = require ( "./olymp_ui")
console.log ( " this is test one ");
async function find_ele( page, ele )
{
    try{
        const next = await page.waitForSelector(ele);
        return true;
    }catch ( e )
    { 
        console.log ( " selector not found:" + ele );
        return false;
    }
    return false;
}

async function process_login_page(browser,page)
{
    //let login_sel_active = await page.$x('//*[text()="Login"]')
    //await do_element_click ( page , login_sel_active[0] );
    
     let sel = ".Button-module-itemTextAlignCenter-1pJ";
     await page.waitForNavigation ( sel );
     await page.click(sel);
   
    await page.waitForSelector('input[type=email]');
    await page.type ( 'input[type=email]',"rhmbrw7@gmail.com");

    await page.waitForSelector('input[type=password]');
    await page.type ( 'input[type=password]',"crtLCD!1");

    //await  page.screenshot({path:"oly_104.jpg"});
   // await page.waitForSelector('form > .ButtonBase-module-host-jU9');
   // await page.click('form > .ButtonBase-module-host-jU9');
    await page.waitForTimeout(60000);
    
    let login_sel = await page.$x('//*[text()="Log In"]')
    await do_element_click ( page , login_sel[0] );
    //await page.click('form > .ButtonBase-module-host-jU9');
    console.log ( "clicked submit just ");
    
}

async function  switch_to_currency ( browser , page , symbol )
{
    await  show_assests_menu ( browser , page );
    let  symbol_xpath  = "//*[text()='" + symbol + "']";
    console.log ( symbol_xpath );
    
    let  symbol_ele    = await page.$x ( symbol_xpath );
    if ( symbol_ele && symbol_ele.length > 0 )
    {
        console.log ( " xpath found: " + symbol_xpath );
        //let new_page  =  await browser.newPage();
        console.log ( "new page created .. ");
        await symbol_ele[0].click ( {button:'middle'});
        /* await new_page.evaluate ( (ele)=>{
            ele.click();
        }, symbol_ele[0] );*/
    }
    /*let  symbol_ele    = await page.$x ( symbol_xpath );
    if ( symbol_ele && symbol_ele.length > 0 )
         do_element_click_new_tab ( page , symbol_ele[0]);
    else{
        console.log ( "***---------------- unable to click: " + symbol_xpath );
    }*/

}

async function get_duration_str ( tm_hour , tm_min  )
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
async function  show_assests_menu ( browser , page  )
{
    let asset_eles = page.$x ( "//*[text()='Assets']")
    console.log  ("asset_eles: " + asset_eles.length );
    if ( asset_eles.length )
         console.log ( "menu is already activated") ;
    else {
        let fxtt_sel    = "div.asset-button__title";
        await page.waitForNavigation ( fxtt_sel );
        await page.click ( fxtt_sel );
        //asset_eles =  page.$x ( "//*[text()='Assets']");
        //console.log ( "----menu is already activated: " + asset_eles.length ) ;
    }
    /*
    await page.waitForNavigation ( fxtt_sel );
    await page.click ( fxtt_sel );
    await page.waitForNavigation ( fxtt_sel );
    await page.click ( fxtt_sel );
    */
    /*
    let fxtt_xpath  = "//*[text()='Fixed Time']";
    let fxtt_ele        = await page.$x ( fxtt_xpath ); 
   // console.log  ( fxtt_ele.getProperty("visible") );
    console.log ( fxtt_ele.length );;
    let assests_sel  = "div.asset-button__title";

    if ( !fxtt_ele || fxtt_ele.length == 0 ) 
    {
        console.log ( "fxtt not shown ");
        let fxtt_ele = await page.$ ( assests_sel );
        if ( fxtt_ele && fxtt_ele.length > 0 )
            await fxtt_ele.click();
    }
    // swith to correct tab if focus was else where. 
        console.log ( "fxtt already invoked -- reclicking it.");
        fxtt_ele        = await page.$x ( fxtt_xpath ); 
        console.log ( fxtt_ele.length );
        if ( fxtt_ele && fxtt_ele.length > 0 )
            await fxtt_ele[0].click();
    */
}

// problem here is as follows:
// xpath is not clickable, page evaluate is used.
// need to wait so that page is handle is returned.
// test above with promise wait api.
// or if selector works then implement someother time.
async function  process_main_page(browser,page)
{
    console.log ( "not the login page ... waiting .. ");
    console.log ( "done clicking show trades.");
    await show_assests_menu(browser , page);
    
    /*
    await switch_to_currency ( browser , page , "USD/JPY");
    await page.waitForTimeout ( 10000 );
    await switch_to_currency ( browser , page , "GBP/USD");
    await page.waitForTimeout ( 10000 );
    await switch_to_currency ( browser , page , "AUD/USD");
    await page.waitForTimeout ( 10000 );
    await switch_to_currency ( browser , page , "EUR/JPY");
    await page.waitForTimeout ( 10000 );
    await console.log ( await "all items are clicked ");
    */
}
async function do_element_click_new_tab ( page, ele )
{
    await page.evaluate ( (ele)=>{
        ele.click('a[target=_blank]');
    }, ele );
   
}
async function do_element_click ( page, ele )
{
    await page.evaluate ( (ele)=>{
        ele.click();
    }, ele );
   
}

async function close_assets_panel ( page )
{
    let sel = ".cor-w-panel-c-header__center > .cor-w-panel-l-header__center > .cor-w-panel-l-header__actions > ._1L0VNFDz > .SvgIcon-module-host-3SE";
    try { 
            await page.click(sel)
    } catch ( err )
    {
        console.log ( "[close_assets_panel] .... was not active: " + err.message );
    }
}
async function show_assets_panel ( page )
{
    let sel_asset  = "div.asset-button__title";
    await page.waitForSelector ( sel_asset );
    await page.click ( sel_asset );
}
async function get_symbol_list ( page )
{
    let ret_arr = [];
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
         ret_arr.push ({index:a, symb_name:text});
         //console.log ( " i = " + a + " -- " + text  );
     }
     await close_assets_panel ( page );
     return ret_arr;
}

async function switch_symbol ( page , symbol, to )
{
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
         console.log ( " i = " + a + " -- " + text  );
         if ( text.toLowerCase().includes ( symbol ) ) 
         {
            try{
              await ele.click();
              await page.waitForTimeout(to);
   
              return true;
            }catch ( err ) { console.log ( "error occured: " + err.message ); }
        }
     }
     //await close_assets_panel ( page );
     return false;
}


async function set_trade_duration ( page , tm_hour , tm_min )
{
    let duration_sel = "input[data-test='deal-duration-input']";
    await page.waitForSelector ( duration_sel );
    let dur_str = await get_duration_str ( tm_hour , tm_min );
    //console.log ( dur_str );
    await page.click( duration_sel , {clickCount:1});
    await page.keyboard.press('Home');
    await page.type ( duration_sel , dur_str , {delay:150});
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.click ( "rect.rectCover")
    //await page.mouse.move ( 0, 0 );

}

async function trade_open_buy ( page )
{
    await page.waitForSelector('.deal-buttons > .deal-button_up')
    await page.click( '.deal-buttons > .deal-button_up')
}

async function trade_open_sell ( page )
{
    await page.waitForSelector('.deal-buttons > .deal-button_down')
    await page.click( '.deal-buttons > .deal-button_down')
}
async function get_amount_str   ( amount )
{
    return amount + "";
}
async function set_trade_amount ( page , amount )
{
    let amount_sel = "input[data-test='deal-amount-input']";
    await page.waitForSelector ( amount_sel );
    let amount_str = await get_amount_str ( amount );
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

async function open_trade ( page , dir , amount , dur_hr , dur_min )
{
    await  set_trade_amount ( page , amount );
    await  set_trade_duration ( page , dur_hr , dur_min );
    if ( dir == "buy" )
        await trade_open_buy ( page );
    else if ( dir == "sell" )
        await trade_open_sell ( page );
}

async function run ()
{
   
    console.log ( " in run ");
    const  browser = await pup.launch({ userDataDir: './data',headless:false ,'slowMo':100});
    const  page    = await browser.newPage();
    //await page.waitForNavigation();
    
    await  page.goto("https://olymptrade.com", {waitUntil: ['domcontentloaded'], timeout: 60000});
    //await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    await  page.setDefaultNavigationTimeout(60000);
    
    let sel = "div.js-main-chart-container.main-chart-container > div.chart-bottom > div > div > select";
    let input_tm_str = "1 hours"

    let change_zm_lvl  = new change_zoom_level ( page , sel,  input_tm_str );
    change_zm_lvl.print();
    await change_zm_lvl.run();
    // test for change symol , amount , dur .
    return;
}
run(); 
//    zoom level is one of the component.
//    included by olmp_impl. which has 
//    selected function which carries out the task using 
//    trade_obj in object form.
//    sent by option_pltfrm_impl. which encapsulates it.
//    which also fx_pltfrm_impl.
//    different implementations are needed due to options 
//    has extra trade_arr sorted by closing time.
//    it constantly interrogated by pltfrm for closing top
//    most trade.
//    therefore, following classes are needed, without inheritance.
//    trade_t.js   trade_lst_t.js  trade_lst_w_q.js(for options and inherited)
//    trd_pltfrm.js    which encapsulates fx_pltfrm and opt_pltfrm.
//    for opt_plffrm following is needed.
//              trade_lst_w_q.js
//              intermittently running function query_for_closing()
//              which should wait for consuming for any trade in open list. 
//              which itself wait for trade_req open ... from upper layer using connector.
//              once received it notifies query_for_closing.
//              so, query_for_closing..B. and  process_trade_open_request ( )..A. only.
//              A/B are mutually exclusive. 
//    A. calls --->  opt_pltfrm_impl.open_trade ---> keeps internal trade_lst. 
//    B. calls --->  opt_pltfrm_impl.check_for_close_trade ( )

//    therefore, now implement.   opt_plfrm_impl  ----> olymp_opt_impl.
//    as follows.
//       open_trade ( trade )
//       check_for_closing ( top_most_trade )    

//   main problem is:
//           queueing of orders and subscriber process it one at a time.
//           at the same time if order_cnt>0 another routine checks for last
//           order closing by reading n orders.
//  e.g. network ---> to queue  , to subscriber.
//       queue empty is setted by check_for_closing. it breaks from while loop. setintrvl.
//       queue_empty = false is setted if there is a order.
//       mutually exclusive is done using ... every n open order ... checkforclosing.
//       awaiter function or subscribe does it. entry for closing still returns
//       without going into implementation by only checking if time has expired.
//       thus opening of order is not disturbed.

//  to implement; following has to be done.
//  implement open_trade,checkforclosing.
//  test open_trade and check_for_closing as required.
//  implement upper layer. with trade_lst.
//  class olymp_opt_impl.







/*



      await trade_open_buy ( page );
      await trade_open_sell ( page );
      await trade_open_buy ( page );
      await trade_open_sell ( page );
      await trade_open_buy ( page );
      await trade_open_sell ( page );
      await trade_open_buy ( page );
      await trade_open_sell ( page );
    */
    /*
    let symbol_list = await get_symbol_list ( page );
    //await close_assets_panel ( page );
    for ( let a = 0; a < (await symbol_list.length); a++ )
    {
        let symb = symbol_list [ a];
        console.log ( symb.index + " -- " + symb.symb_name );
        await switch_symbol ( page , symb.symb_name.toLowerCase() , 30000 );
    }
    */
   // if ( tr && await find_ele ( page , login_sel ) ) 
   // {
       // await process_login_page ( browser, page );
       // await process_main_page ( browser , page ); 
   // }
   // else
   // {
     //   console.log ( " already logged " );
       // let fxtt_sel    = "div.asset-button__title";
       // await page.waitForTimeout(30000);
       // await page.waitForNavigation ( fxtt_sel );
       // await page.click ( fxtt_sel );
        //await process_main_page ( browser , page ); 
   // }
    /*
    let ele = '.page > .cookie-container > .cookie-consent > .cookie-consent__container > .ButtonBase-module-host-jU9';
    if ( find_ele ( ele ) === true )  // click cookie element if found.
    {
        await page.click(ele);
    }*/    





