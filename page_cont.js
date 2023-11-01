const  pagescraper   =    require ( "./page_scraper.js" );

async  function scrape_all (  browserins ) 
{
	let browser;
	console.log ( "scrappell func in moduel called.")
	try{
		browser = await browserins;
		await browserins.newPage();
		console.log ( "calling scraper...pagescraper.")
		await pagescraper.scraper ( browser );
	}
	catch ( err )
	{
		console.log ( " could not resolve browser instance " , err );
	}
};
module.exports = (browserins) => scrape_all ( browserins )
