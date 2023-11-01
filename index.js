const browserobj     =   require ( "./browser" );
const scrapercont    =   require ( "./page_cont");
const pup = require ( "puppeteer");
async function run ()
{
    try{
//    let brow = await pup.launch ( {headless:false} );
 //   let page = await brow.newPage();
    
let  browserins      =  await browserobj.startBrowser(true);
//scrapercont ( browserins );
//let  browseri         =  await browserins;
//let  browser         =  await browserins;
let page = await browserins.newPage();
let url = "http://books.toscrape.com";
await page.goto ( url );
await page.waitForSelector( 'section' );//scrapercont ( browserins );
console.log ( " section selected ");
const eles = await page.$$( 'section  ol > li'); //, async (eles)=>{
   // console.log ( "inside ")
   // console.log ( await eles.length );
   // console.log ( eles );
//    return eles;
//});
console.log ( " out length " , eles.len );
//console.log ( eles );
eles.forEach ( el => console.log ( el ) );
//console.log ( "exiting...");
//(await page).waitForTimeout(50000);
    }catch ( err )
    {
        console.log ( err );
    }
console.log (" finishing .. ");
};

run();