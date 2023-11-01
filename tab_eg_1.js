// hash map review.
// module example.
// page in hashmap.

// create three tabs,
// save in hash map.
// create module for get_browser, implement api.

// in module implement get_page which keeps internally hashmap of pages.




Array.prototype.each_2 = async function(cb,to)
{ 
  var interval = to;
	var increment = 1.0;
	this.forEach ( (el) =>{
		  var run = setTimeout ( async ()=>{
			  await cb(el);
			  clearTimeout ( run );
		  } , interval * increment );
		  increment = increment + 1;
	  });
}
/*
var arr = new Array( 'a','b','c','d','e','f');
arr.each_2 ( async  (el) => { 
     console.log ( "el:", el ) 
    
  },1000);
*/
const pup  =  require ( "puppeteer" );
const [browser__,page__]  =  require ("./browser");

let lnks_arr = new Array(     {url:"https://news.bing.com",name_:"bing_news",txt:""},
                    {url:"https://www.dawn.com" ,name_:"dawn_news",txt:""},
                    {url:"https://www.brecorder.com",name_:"brecorder",txt:""},
     
                  ); 

var get_urls = async function ( brws )
{
  var books_pg  =  await brws.load_new_page_by_name ( "books_page","https://books.toscrape.com" );
  var pg = books_pg.page;
 
  let urls = await pg.$$eval('section ol > li', links => {
              // Make sure the book to be scraped is in stock
              links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
              // Extract the links from the data
              data = new Array();
              var cnt = 0;
              links.forEach(el => {
                                let lnk   = el.querySelector('h3 > a'); 
                                data.push({url:lnk.href,txt:lnk.textContent,name_:"name_"+cnt}); 
                                cnt++;
                              } 
                        );
              return data; 
    });
    return urls;
}
// bookstoscrape  google_serp and add one more site.
// implement api for do_click w name.
// note new page will open.
// then implement api for plfrm.
var get_click_regions = async function ( page , selector  )
{
 // if ( selector starts with )
    {
        let rgns  =  await  page.waitForXPath ( selector );
        let clck_rgns =  await page.$x ( selector );
        return clck_rgns;  
    }
   
}
const puppeteer = require ( "puppeteer");
var run = async function ()
{
    //const element = await page.$("a");
    //const text = await (await element.getProperty("innerText")).jsonValue();
    //console.log(await text);
   
    
        
    const  brws = new browser__();
    await  brws.init_instance  (false);
    /*
    let urls = await get_urls ( brws );
    console.log ( urls[1] );
    await  brws.load_pages_one_by_one_w_name ( urls.slice ( 0, 5 ) ,0000 );
    // await  brws.show_pages();
    await  brws.activate_pages_one_by_one_w_name ( urls.slice(0,5) ,10000 );
    */
   console.log ( "page_cnt:", await brws.get_page_cnt () );
   let pg = await brws.load_new_page ( "http://books.toscrape.com" , 1000 );
   await pg.page.setDefaultNavigationTimeout ( 130000 );
   console.log ( "page_cnt:", await brws.get_page_cnt () );
   //let sel = '//ul[@class="breadcrumb"]/li[text()]/a';
   //let sel = "//ul[@class='breadcrumb']/li" ;
   let sel   = "//a[contains(text(),'me')]";
   //let  sel  = "//a";
   var rgns =  await get_click_regions ( pg.page , sel  );
   
   console.log ( "length: " , await rgns.length );
   let i = 0;
    
  // await brws.load_clicks_one_by_one ( pg , rgns.slice(0,3) , 4000 );
  // await brws.activate_pages_one_by_one ( 10000 );
  await brws.load_clicks_one_by_one_w_name  ( "r", pg , rgns.slice(0,5) , 4000 );
  await brws.activate_clicks_one_by_one_w_name ( "r" , 4000 );
};

    
    /*
    var books_pg  =  await brws.load_new_page_by_name ( "books_page","https://books.toscrape.com" );
    var pg = books_pg.page;
   
    let urls = await pg.$$eval('section ol > li', links => {
			// Make sure the book to be scraped is in stock
			links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
			// Extract the links from the data
			data = new Array();
      var cnt = 0;
      links.forEach(el => {
                        let lnk   = el.querySelector('h3 > a'); 
                        let value = lnk.href; 
                        data.push({href:value,txt:lnk.textContent,name:"name_"+cnt}); 
                        cnt++;
                      } 
                );
			return data; 
		});*/
    // here create 3 address with pause and switch to it.
   
    /*
    
  /*
  const brow  =  await pup.launch ( {headless:false});
  console.log ( "starting");
  var pages = []; var page_map = new Map ();

  var new_page = async function ( el, to )
  {
      let page = await brow.newPage();
      await page.setDefaultNavigationTimeout ( 130000 );
      await page.goto ( el.url );
      await page.waitForTimeout ( to );
      pages.push ( { name_: el.name_, page:page} );
      console.log ( 'saved ' , el.name_ );
      page_map.set ( el.name_ , page );
  }

  const loop_ = async function ( )
  {
      for ( let i = 0; i < lnks_arr.length; i++ )
      {
        await new_page ( lnks_arr[i],1000 );
        console.log ( lnks_arr[i]    );
        
      }
  }

  const switch_to  = async function() 
  {
    for ( let i = 0; i < pages.length; i++ )
    {
        await pages[i].bringToFront();
        await pages[i].waitForTimeout ( 10000 );
    }
  }
  const switch_to_2  = async function (  ) 
  {
    console.log ( "in switch_to_2...", page_map.size );
    for ( let i = 0; i < lnks_arr.length; i++ )
    {
         console.log ( "finding ... ", lnks_arr[i].name_ );
         let pg = page_map.get ( lnks_arr[i].name_ );
         await  pg.bringToFront();
         await  pg.waitForTimeout ( 10000 );
    }
  }
  await loop_();
  await switch_to_2 ();
 */
/*
  let page_map = new Map();
  const brow  =  await pup.launch ( {headless:false});
  for ( let i = 0; i < lnks_arr.length; i++ )
  {   
      let el = lnks_arr[i];
      try{
      console.log(el); 
      let page = await brow.newPage();
      page_map.set ( el.name_ , page );
      await page.goto ( el.url );
      await page.waitForTimeout ( 4000 );
      }catch ( err ) { console.log ( "err occured ", err.message );}
  } 
  for ( i = 0; i < lnks_arr.length; i++ )
  {
        
        let pg = page_map.get ( lnks_arr[i].name_);
        if ( pg != null ){
        await pg.bringToFront();
        console.log ( "activating tab:", lnks_arr[i].name_ );
        await pg.waitForTimeout ( 10000 );
        }  
  } */
//}  

//const page  =  await brow.newPage();
  
 // const brws  =  new browser__();
 // await brws.init_instance (false);
  
  
  

  //for ( let lnk of lnks_arr )
  //  {
     // console.log  ( lnk );  
     /*
     var no = 0;
     try{
       setTimeout ( ()=>{
       brws.load_new_page ( );
       },4000 );
     }catch ( err ) { console.log ( "message:", err.message, "--" );}
     try{
       setTimeout ( ()=>{
          brws.load_new_page ( );
       }, 10000 );
     }catch ( err ) { console.log ( "message:", err.message," -- ");}
     try{ 
       setTimeout ( ()=>{
       brws.load_new_page ( );
       },10000 );
     }catch ( err ) { console.log ( "message:", err.message, "-- " );}
     */
     
    //pages.push ( page );
     //await page.setDefaultNavigationTimeout ( 130000);

     // await page.goto ( lnk.url );
    //  await page.waitForNavigation();
      //console.log ( await page.title() );
     // await page.waitForTimeout ( 10000 );
  //  }
  
  /*
	let pages = [];
  for ( let lnk of lnks_arr )
    {
     // console.log  ( lnk );
     const page = await brws.browser.newPage();
     pages.push ( page );
     await page.setDefaultNavigationTimeout ( 130000);

      await page.goto ( lnk.url );
    //  await page.waitForNavigation();
      //console.log ( await page.title() );
      await page.waitForTimeout ( 10000 );
    }
  for ( let pg of pages )
  {
      await pg.bringToFront();
      await pg.waitForTimeout ( 10000 );
  }*/
  // let brws  =  new browser__(false);
   // await brws.init_instance();
   // await brws.load_new_page ( lnks_arr[0].url );
   // console.log ( lnks_arr[0] );
    //let pg_1   =   await brws.load_new_page ( lnks_arr[0].url );
   // await brws.close();

    //await brws.activate_pages_one_by_one_w_name    ( urls.slice(0,5) , 10000 );
   // console.log ( " await ******************************************************");
    
    // await await_log();

   // await  brws.activate_page_by_name ( "name_2");
   // await console.log ( await brws.page_map.keys() );
  //  let pg_2 = await brws.get_page_by_name ( "name_2");
   // await pg_2.activate();
  //  await brws.close ( 300000 );
 
    // today todo:
  // fix one by one problem. 
  // fix all at once.
  // fix wait problem.
  // puppeteer link click practise for different site.
  // read notes on networking , emit, file.
  // practise networking and file.
  // implement codes.
  
  // A. 
  // array of links e.g. 4.
  // open link in a loop.
  // then fix the proplem.
  // then implement function.
  // then implement function in class.

  //let links = new Array ( ["https://news.yahoo.com"],["https://news.google.com"],["https://news.bing.com"],["https://dawn.com"],["https://news.com"]);
  // today:
// implement the function. one_by_one. as above.
// implement for link clicking.


  //await brws.load_one_by_one ( links , 10000 );
 // await brws.close ( 00000 );
  
  //brws.get_new_page ( "https://news.google.com" );
 // brws.get_new_page ( links[1] );
  
  
  
  //console.log ( links[1] );


    /*
    var pages   =  await brws.open_pages ( urls.slice(0,10), 000 );
  //  console.log ( await brws.page_map.size );
    await brws.activate_pages_one_by_one ( "name" , 10000 );
    */
    // notes links has format:  href,txt,name.
    // pass it to some function: which opens tabs.
    // then switch to tabs one by one.


		//console.log(urls);
   // urls.forEach ( el => console.log ( "name:",el.name , "txt:",el.txt , " key:" , el.href) );
    
     
    
    // page.evaluate takes handle on second parameter and returns a value. or object.
    // selector  $ or $$ returns multiple values or clickable regions , than can be clicked.
    // or can be mapped using $eval  or $$eval which takes selector on the left , function on the 
    // right.

    // examples:
    /*
      simple click:
      await page.click('.search-results a');
      const resultLinks = await page.$$('.search-results a');
      const resultLinks = await page.$$('.search-results a');
      if (resultLinks.length) resultLinks[0].click();

      with xpath for inner text:
      const [linkHandler] = await page.$x("//div[contains(., 'textcontained')]");
      if(linkHandler)  await linkHandler.click(); 
    
      $$ returns multiple links.  $$evaluate passes arg0 selector arg1 to the function.
          $$eval ( '' , ()=>{} )   // which evaluates as javascript and returns array usually.
      
  
    */

    
   // console.log ( "finishing" );
 //   await brws.close();


    //console.log ( await browser__.get_title()    );
    //console.log ( await browser__.get_instance() );
    //let page = browser__.get_page();
  // get browser instance.
   //browser  =  browser__.get_instance(false);
    //        const brw = await pup.launch({headless:false});
      //  const c = new a_class (brw);
        //c.b();
        //        (await brw).close();
   //console.log ( browser__ );
  // let brwsr  = new browser__ ( false );
   //console.log ( brwsr.cnt );
  // brwsr.close_();

  // await brwsr.browser.close();
   //await brwsr.get_instance ( false );
   //let page_1 = await brwsr.get_new_page ("https:www.bing.com");
  // let page_2 = await brwsr.get_new_page ("https:www.yahoo.com");
  //brwsr.browser.newPage();
  //brwsr.close_();
//}  // end_run.





/*    
    const pages   = new Map();
    //const browser = await  pup.launch({headless:false});
    const browser       = await brwsr.startBrowser(false);
    console.log ( await brwsr.get_title() );
    return ;
    const page    = await browser.newPage();
    const url     = "https://www.google.com";
    await page.goto(url);


    const page_1  = await browser.newPage();
    await page_1.goto("http://news.bing.com");
    
    const page_2  = await browser.newPage();
    await page_2.goto("http://news.google.com");

    const page_3  = await browser.newPage();
    await page_3.goto("http://www.yahoo.com");

    pages.set ( "page_1" ,page_1);
    pages.set ( "page_2" ,page_2);
    pages.set ( "page_3" ,page_3);
    
    await (pages.get("page_1")).bringToFront();
    await page.waitForTimeout(15000);
    await (pages.get("page_2")).bringToFront();
    await page.waitForTimeout(15000);
    await (pages.get("page_3")).bringToFront();
    await page.waitForTimeout(15000);
    
*/
    /*
    const map1 = new Map();
    map1.set ( "a" , 1 );
    map1.set ( "b" , 10 );
    map1.set ( "c" , 1000 );
    for ( [key,val] of map1 )
        console.log ( "key="+key , val  );     
    for ( key of map1.keys())
        console.log ( key )
        */

    

run();