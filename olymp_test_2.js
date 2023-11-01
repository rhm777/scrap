// following tests brow.pages efficiency.
// test_2 would be browser.bind etc. and testing same for click by contain text for olymptrade.
const  pup  =  require ("puppeteer");

function brow ( )
{
    this.get_page_cnt = async function ( )
     {
        let pages = await this.pages();
        console.log ( pages.length  );
     }   
}

let pages   = null;
(async ()=>{
const browser  =  await pup.launch ( {userDataDir: './data',headless:false,devtools:false,slowMo:0});


console.log ( typeof ( browser ) );
console.log ( typeof ( brow ) );

let b = new brow();
let c = b.get_page_cnt.bind ( browser );
await c();
 

//await browser.waitForTarget( ()=>false );
//await browser.close();
})();