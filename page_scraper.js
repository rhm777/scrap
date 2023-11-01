const pup = require("puppeteer");
const  scraper_obj = {
	url: 'http://books.toscrape.com',
	async scraper(browser)
	{
		let page = await browser.newPage();
		console.log ( " new page is being created from browser ... ");
		console.log ( `navigating to ${this.url} ` );
		await page.goto ( this.url );

	/*	const links = await page.evaluate(() => 
    // let's just get all links and create an array from the resulting NodeList
     Array.from(document.querySelectorAll("a")).map(anchor => [anchor.href, anchor.textContent])
        );
		console.log ( links );	
		*/
		await page.$$eval ( 'section > ol > li > article > h3', async (eles)=>{
				console.log ( eles );
		});
		/*eval ( 'section ol > li > article > h3',  async ( links ) => {
				console.log ( "link:", links.length);
				
				return links;
		});*/;
		//let cnt = await page.content();
		//console.log ( cnt );
		/*for ( i = 0; i < urls.length; i++ )
		{
			console.log ( " i = " , i );
			console.log ( " value " , urls[i] );
		}*/
	}
};
console.log ( " obj scraper_obj is created...");
	
module.exports  =  scraper_obj;
