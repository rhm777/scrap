const puppeteer = require('puppeteer');


(async () => {
    const browser = await puppeteer.launch({headless: false,args:['--start-maximized']});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout ( 100000 );
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://carmalou.com', { waitUntil:'load'});
   
 //   const linkHandler = await page.$x("//a[contains(., 'About')]");
    
     const linkHandler = await page.$x("//a[@class='page-link']");
     console.log ( linkHandler.length );
     arr = [];  
     var page_2 = browser.newPage();
     if ( linkHandler.length > 0 )
     {
         for ( i = 0; i < linkHandler.length; i++ )
         {
            var hr  = await page.evaluate ( lnk => [lnk.innerText||lnk.textContent,lnk.href], linkHandler[i]);
           // console.log ( hr );
            await Promise.all ( [ page.waitForNavigation(),page.goto(hr[1])], page.waitForTimeout(3000) );
            arr.push ( hr );
         }   
    }
    console.log ( arr );

     /* open_a_links. open_a_link. in a module. no pause.
     // open_links in same window with pause.
     if ( linkHandler.length > 0  )
     {
          //  var page_2 = browser.newPage();
            for ( i = 0; i < linkHandler.length; i++ )
            {
                await linkHandler[i].click({button:'middle'});   
                //var cnt = (await browser.pages()).length;
                //await page.waitForTimeout(1000);
            }
            console.log ( " tabbing now " , (await browser.pages()).length );
            for ( i  = 1; i < (await browser.pages()).length; i++ )
            {
                var page_list  = await browser.pages();
                await page_list[i].bringToFront();
                await page.waitForTimeout(1000);
            }    
            await browser.close();
     }  
     */
     /*const hrefs1 = await page.evaluate(
        () => Array.from(
          document.querySelectorAll('a[href]'),
          a => { return [a.textContent, a.href] }
        )
      ); */
  //  const [linkHandler2] = await page.$x("//a[contains(., 'Categories')]");
    // await browser.close();
  })();