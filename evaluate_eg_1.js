


const pup  =  require ( "puppeteer" )



var run = async function ()
{
    const browser = await  pup.launch({headless:false});
    const page    = await browser.newPage();
    const url     = "https://www.google.com";
    await page.goto(url);
    
    async function search_for ( val )
    {
       // console.log ( val );
         await page.evaluate ( (val) => {
          document.querySelector ( "input[name='q']" ).value = val;  
          },val);
         //await page.evaluate ( ()=>document.querySelector("input[value='Google Search']").click()
         //); // use navigation instead.
         await Promise.all ( 
                [
                    page.waitForNavigation(),
                    page.evaluate ( ()=> document.querySelector("input[value='Google Search']").click())
                ]
            )   
/*
         let arr_1  =  await page.evaluate ( () =>{
                return (Array.from ( document.querySelectorAll ( 'a cite').values())).map ( el =>el.innerHTML );
         });
           console.log ( arr_1 ); */
         let arr  =  await page.evaluate ( () =>{
            return document.querySelectorAll ( 'a cite'); //[7].click({button:'middle'});
            //return (Array.from ( document.querySelectorAll ( 'a cite'), (el)=>el.innerHTML ))
            //.map ( el =>el.innerHTML );
         });
       //  console.log ( arr );
        //    await   arr[7].click ( {button:'middle'});
        var lnks  =  await page.$$('a cite');
        let pages_map = new Map ();
        
        let pages     ;
        for ( i = 0; i < lnks.length; i++ )
        {
            console.log ( "i=" , i );
            console.log ( lnks[i] );
            try{
            await lnks[i].click({button:'middle'});
          //  await page.waitForTimeout ( 10000 );
            let len = (await browser.pages()).length;
            pages   = await browser.pages();
            pages_map["page"+i ] = pages[len-1];
            await page.waitForTimeout ( 4000 );
        }catch (err)
            {
                console.log (" link not clickable ", err.message);
                await page.waitForTimeout ( 10000 );
            }
        }
        console.log ( pages_map.keys() );
        
        console.log ( " tabbing now " , (await browser.pages()).length );
        while ( true )
        {
            for ( i  = 1; i < (await browser.pages()).length; i++ )
            {
                var page_list  = await browser.pages();
                await page_list[i].bringToFront();
                await page.waitForTimeout(1000);
            }   
        }
            //console.log ( arr );
        //arr[0].click();
        

     //   console.log ( arr);
    }


    await search_for ( "puppeteer evaluate functions");
};
run();




// Notes:
/*
    page.evaluate runs javascript functions. e.g.
        querySelector  //  querySelectorAll  //  getElementByXPath  e.g.
    first value is function. if there is a args , the arg_list is then followed.
    it can also do clicks etc.
    Array.from takes iterator, second optional argument is the element and return value will be added
    to the array.
    example:
    onst hrefs1 = await page.evaluate( () => Array.from( document.querySelectorAll('a[href]'),
                    a => { return [a.textContent, a.href] } )  ); 
    e.g.
      var hr  = await page.evaluate ( lnk => [lnk.innerText||lnk.textContent,lnk.href], linkHandler[i]);
*/
// this page example list.