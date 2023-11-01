// following test_2 would be browser.bind etc. and testing same for click by contain text for olymptrade.
// next test_3 will be for.

const  pup  =  require ("puppeteer");


let pages   = null;
(async ()=>{
const browser  =  await pup.launch ( {userDataDir: './data',headless:false,devtools:false,slowMo:0});

let browser_get_length = async function ( brow ){
    let pages = await brow.pages();
    let len   = await pages.length;
    return len;
}
let browser_get_page = async function ( brow , i ){
    let pages = await brow.pages();
    return pages[i];
}
async function browser_get_last_page_title ( brow )
{
    let pages = await brow.pages();
    let len   = await pages.length;
    return await ( pages[1]).title();
}
console.log ( "page_length: " + await browser_get_length (browser) );
pages  = await browser.pages();
let page_0  = pages[0];

await pages[0].goto  ("https://www.olymptrade.com", { waitUntil: 'load', timeout:0});
await pages[0].goto ( "https://www.bing.com",{ waitUntil: 'load',  timeout:0})
await pages[0].goto ( "https://www.olx.com.pk",{ waitUntil: 'load',  timeout:0})

let len = 0;
let title = "";
let ts = 500;

await browser.newPage();;
len = await browser_get_length (browser);
let page_2 = await browser_get_page ( browser , len-1 );
await page_2.goto ( "https://www.news.com", { waitUntil: 'load',  timeout:0})
await page_2.waitForTimeout( ts )
console.log ( "page_length: " + len + " --- title:" + await page_2.title() );

await browser.newPage();
len = await browser_get_length (browser);
let page_3 = await browser_get_page ( browser , len-1 );
await page_3.goto ( "https://www.dawn.com", { waitUntil: 'load',  timeout:0})
await page_3.waitForTimeout( ts )
console.log ( "page_length: " + len + " --- title:" + await page_3.title() );


await browser.newPage();
len = await browser_get_length (browser);
let page_4 = await browser_get_page ( browser , len-1 );
await page_4.goto ( "https://news.bing.com",{ waitUntil: 'load',  timeout:0})
await page_4.waitForTimeout( ts )
console.log ( "page_length: " + len + " --- title:" + await page_4.title() );




//await pages[0].goto  ("https://www.bing.com", {load:true, timeout:0});
//console.log ( "page_length: " + await browser_get_length(browser) );
/*await browser.on('targetcreated', async function(){
    console.log ( "[on]page_length: " + await browser_get_length (browser) );
    console.log ( "title of last_page:"  + await browser_get_last_page_title(browser) )
} );*/



/*await page_0.evaluate ( () => {
    window.open("https://news.bing.com");
});*/
/*
*/

/*
async function on_new_tab ( )
{
    pages  = await browser.pages();
    console.log ( await pages.length );
    for ( let i =0; i < pages.length; i++ )
        console.log ( "title: " + await pages[i].title() );
    if ( promise_resolver != null )
         promise_resolver();
}*/


/*
async function open_link ( url  )
{
    return new Promise ( async (resolve, error )=>{
    let url_ = url; 
    await page_0.evaluate ( async (url_) => {
        await window.open(url_) 
    }, url_ );

    await browser.on('targetcreated', async function(){
      //  console.log ( "target for " + url + " has been created...")
        console.log ( " -----------------> " + await ( await browser.pages()).length );
        let cnt =  await ( await browser.pages()).length;
        //console.log ( " ************* " + cnt );
        await resolve(url, cnt );
    } );
    });
} */

/*
await open_link("https://www.news.com").then  (
   async  (lnk,cnt )=>{console.log ( "LNK:" + lnk + " -- " + cnt ); 
                console.log ( await last_page_title());
                }
    );
*/
//}) ;

//await open_link( "https://www.news.com").then ( (lnk)=>console.log ( "LNK:" + lnk ));
//await open_link( "https://news.yahoo.com");




//console.log ( await pages[0].title() );

/*
const linkHandlers = await page_0.$x("//*[contains(text(), 'Assets')]");
console.log ( linkHandlers.length );
if ( linkHandlers && linkHandlers.length > 0) {
  await linkHandlers[2].click();
  console.log ( await pages[0].title() );

} else {
    console.log ( "linkhandlers empty ");
//  throw new Error("Link not found");
}*/

//await browser.close();
/*
const sleep  = duration => new Promise ( (resolve) => setTimeout(resolve,duration));
console.log (  "sleep started ...  " + Date.now() );
await sleep ( 10000 ).then(console.log("then occured" + Date.now()));
console.log (  "sleep ended ...  " + Date.now());
*/


//await browser.waitForTarget( ()=>false );
//await browser.close();
})();