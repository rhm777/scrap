
//await browser.waitForTarget(() => false);
//{ devtools: true }
//{ headless: false, slowMo: 200 }

/*
var interval = to;
var increment = 1.0;
await arr.forEach ( (el) =>{
	  
	let url = el.href, name_ = el.name, txt = el.txt; 
	  var run = setTimeout ( async ()=>{
		  console.log ( "loading name:", name_ , " txt:", txt,  " url:", url );
		  await this.load_new_page_by_name ( name_ , url );
		  clearTimeout ( run );
	  } , interval * increment );
	  increment = increment + 1;
  });*/


const puppeteer  =   require ( "puppeteer" );

var page__    =  function ( browser , page )
{
     if ( page ==  undefined )
		  page = null;
     this.page_name = "";	
	 this.browser   = browser;
	 this.page      = page;
	 // this.url       = url;
	 //await this.visit_url ( url );
}

page__.prototype.wait        = async function (  to )
{	if ( to == "undefined")
		 to =   0;
	await this.page.waitForTimeout ( to )
}

page__.prototype.get_page    = async function()
{
	return this.page;
}
page__.prototype.get_title = async function  ( )
{
//	console.log ( "title", await this.page.title() );
	if ( this.page == null )
		 return "";
	return await this.page.title();
}
page__.prototype.visit_url  = async function  ( url, to  )
{
	if ( to == "undefined" ) to = 0;
    if ( this.page == null )
	{
		console.log ( "page instance not initailized...initializing w url: ", url );
		this.page  = await this.browser.newPage();
		await this.page.setDefaultNavigationTimeout ( 130000);
	
	}
	await this.page.goto ( url ); //, { waitUntil:'load'});
	//if ( to != 0 )
	await this.page.waitForTimeout ( to );
}


page__.prototype.load_new_page = async function   (  browser  )
{
	this.browser   = brower;
	this.page      = browser.newPage();
}

page__.prototype.load_new_page_by_name = async function ( browser , page_name  )
{
	this.browser   = browser;
	this.page_name = page_name;
	this.page      = await this.browser.newPage();
}

page__.prototype.activate  =  async function  ( )
{
	if ( this.page == null )
		  return;
	try{
		await this.page.bringToFront();
	}catch ( error )
	{
		console.log ( " error: page.activate: ", error.message);
	}
	console.log ( "activated tab:", await this.get_title() );
} 
page__.prototype.hover  = async function ( ele , to )
{
	await ele.hover ( );
	await this.wait ( to );
} 

page__.prototype.print_all_title  = async function ( )
{
	pages = await this.browser.pages();
	console.log ( "after len: ", await pages.length );
	for ( let i = 0; i < await (pages).length; i++ )
	{
			let txt = await pages[i].title();
			console.log ( "i: ", i , "title:", txt );
	}
}
page__.prototype.click  = async function ( ele , to )
{
	//let pages = await this.page.browser().pages();
	//console.log ( "before len: ",  await pages.length);
	await ele.click ( {button:'middle'} );
    await this.page.waitForTimeout(1000);
	pages = await this.browser.pages();
	
	let pg          =  await pages[pages.length-1];
	console.log ( "click returning title is : ", await pg.title());
	return pg;
} 

// browser class.
var browser__ =  function ( headless ) 
{
    this.browser   =  null;
	//this.headless  =  headless;
	this.curr_page =  null;
	this.pages     =  new Array();
	this.page_map  =  new Map ( );
	this.cnt       =  0;

	//this.init_instance ( this.headless );
};
browser__.prototype.get_page_cnt = async function ()
{
	let pages  = await this.browser.pages();
	let len    = await pages.length;
	return len;
}
browser__.prototype.get_page_no = async function ( i )
{
	 let len = await this.get_page_cnt();
	 if ( i < 0 || i > (len - 1 ) )
	 	return null;
	 let pages =   await  this.browser.pages();
	 return pages[i];
}
browser__.prototype.activate_tab = async function (  no )
{
	 let pg = await this.get_page_no ( no);
	 if ( pg != null )
	 	await pg.bringToFront();
}

browser__.prototype.activate_last_tab = async function (  )
{
	 let len = await this.get_page_cnt();
	 let pg = await this.get_page_no ( len - 1);
	 await pg.bringToFront();
}
browser__.prototype.to  =  async function ( ts )
{
	await setTimeout ( async () =>{console.log("to returning")},ts );
}
browser__.prototype.get_last_page = async function ( )
{
	let  pages   =   await this.browser.pages();
	let  len     =   await pages.length;
	if ( len <= 0 ) return null; 
	return pages[len-1];    
}
browser__.prototype.wait    =   async function ( ts )
{
	//if ( ts > 0 )
	await this.temp_page.waitForTimeout ( ts );
}

browser__.prototype.hover = async function ( page, ele , to  )
{
	await page.hover ( ele, to );
	console.log ( "hover returned");
}
browser__.prototype.init_new_page = async function ( browser , pg )
{
	return new page__(browser,pg );
}
browser__.prototype.click =  async function ( page, ele , to  )
{ 
	let pg = await page.click ( ele, to ) ;     // returns pup.page.
	let page_ = await this.init_new_page ( this.browser, pg );
    console.log("post click ", await page_.get_title() );
 	await page_.activate();
	await page_.wait ( to )
	this.pages.push ( page_ ) ;
	return page_;
}

browser__.prototype.load_clicks_one_by_one =  async function ( par_page, clck_rgns, to  )
{
	for ( let i = 0; i < clck_rgns.length; i++ )
	{
		await this.hover ( par_page , clck_rgns[i] , 2000  );
		await this.click ( par_page , clck_rgns[i] , 4000  );
		await par_page.activate();
	}
}
browser__.prototype.print_page_map  = async function ( )
{
	console.log ( this.page_map.keys() );
}
browser__.prototype.load_clicks_one_by_one_w_name =  async function ( name_prefix, par_page, clck_rgns, to  )
{
	if ( name_prefix == "" )
		name_prefix = "name"
	for ( let i = 0; i < clck_rgns.length; i++ )
	{
		await this.hover ( par_page , clck_rgns[i] , 2000  );
		let ret_page = await this.click ( par_page , clck_rgns[i] , 4000  );
		await par_page.activate();
		let temp_name = name_prefix + "_" + i;
		this.page_map.set ( temp_name , ret_page );
		console.log ( "added:", temp_name , "title was ", await ret_page.get_title() )
	}
}


// from array it has  name,txt, url.
browser__.prototype.load_pages_one_by_one =  async function ( arr, to  )
{
	for ( let i = 0; i < arr.length; i++ )
	{
		let name_ = arr[i].name_, url = arr[i].url;
		await this.load_new_page ( url , to );
		console.log ( "new_pagecount:" , this.pages.length , "---browser:",this.browser.pages().length );
	}
}

// from array it has *name , txt, url.  name must be unique and exists.
browser__.prototype.load_pages_one_by_one_w_name =  async function ( arr, to  )
{
	for ( let i = 0; i < arr.length; i++ )
	{
		let name_ = arr[i].name_, url = arr[i].url;
		await this.load_new_page_by_name ( name_ , url , to );
	}
}
//, slowMo:250

browser__.prototype.init_instance = async function( headless ) {
	
    this.browser   =   await puppeteer.launch ( { headless:headless } );	 
	this.temp_page = await this.browser.newPage();
	await this.temp_page.waitForTimeout(1000);
	return ;
};

browser__.prototype.close = async function ( to )
{
	console.log( "in browser close page count: ", this.pages.length );
	if ( to == "undefined" )
		 to = 0;
	//if ( to > 0 )
	await new Promise ( resolve =>  setTimeout(resolve , to ) );	 
	await this.browser.close();
}


browser__.prototype.load_new_page  = async function ( url, to )
{
		if ( to == "undefined" )
			to = 0;
		if ( this.browser == null )
			this.browser = await this.init_instance ( this.headless );
		
		let pg  = new page__ ( this.browser );
		await pg.activate ( );
		this.pages.push ( pg );
		await pg.visit_url ( url );
		if ( to != 0 )
		   await this.wait ( to )
		return pg;	
}

// load a new page, adds in map. then calls load_new_page
browser__.prototype.load_new_page_by_name  = async function ( name_, url, to )
{
	let pg = await this.load_new_page ( url , to );
	await this.page_map.set ( name_ , pg );
	console.log ( "name is added: " , name_ , " length:" , this.page_map.size );
	
	await pg.activate();
	return pg;
}




browser__.prototype.activate_page     =   async function ( i , to )
{
	if ( to == "undefined" )
		to = 0;
	let  pg  = this.pages [ i ];
	await pg.activate ( );
	//if ( to > 0 )
	await pg.wait ( to );
}

browser__.prototype.get_page_by_name = async function ( name )
{
	return this.page_map.get ( name );
}
browser__.prototype.show_pages = async function  ()
{
	console.log ( "length of page_map ", this.page_map.size );
}

browser__.prototype.activate_page_by_name = async function ( name , to )
{
	//console.log( "**********name is ", name)
	if ( this.page_map.has ( name ) )
	{
		var pg = this.page_map.get ( name );
		await pg.activate();
		await pg.wait ( to );
	}
	else console.log ( "*********name not found...", name );	
}

browser__.prototype.activate_pages_one_by_one = async function ( pause_tm )
{	// list all pages by key.
	for ( let i = 0; i < this.pages.length; i++ )
	{
		await this.activate_page ( i , pause_tm )
	}
	console.log ( "returning....actiave_pages_one_by_one");
}

browser__.prototype.activate_page_by_name     =   async function ( name_ , to )
{
	console.log ( " finding page ", name_ )
	try{
		let  pg  = await this.page_map.get ( name_ ); 	
		console.log ( " --- page was found...." , name_ );
		await pg.activate ( );
		await pg.wait ( to );
	}catch ( err )
	{
		console.log ( " error in activate_page_by_name:" , err.message );
	}
	
}
browser__.prototype.activate_pages_one_by_one_w_name = async function ( arr , pause_tm )
{
	for ( let i = 0; i < arr.length; i++)
	{
		await this.activate_page_by_name  ( arr[i].name_, pause_tm );
	}
	//console.log ( "****returning....actiave_pages_one_by_one_by_name ");
}

browser__.prototype.activate_clicks_one_by_one_w_name = async function ( name_prefix , pause_tm )
{
	for ( let i = 0; i < this.page_map.size; i++)
	{
		let  page_key  =  name_prefix + "_" + i;
		if ( this.page_map.has(page_key) )
		{
			await this.activate_page_by_name  ( page_key , pause_tm );
		}
		
	}
	//console.log ( "****returning....actiave_pages_one_by_one_by_name ");
}





/*
browser__.prototype.start_ins =  async function  ( headless ){
	
	let browser;
	if ( headdless == "undefined") headdless = false;
	try{
		console.log ( "opening browser instance " );
		browser = await  puppeteer.launch ({
			headless:headless,
			args:["--disable-setuid-sandbox"],
			ignoreHTTPErrors:true
			
		} );
		
	} 
	catch ( e )
	{
		console.log ( "could not create browser instance ",e );
	}
	return browser;

};
*/

module.exports = [browser__,page__];




/*
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
}*/
/*
var arr = new Array( 'a','b','c','d','e','f');
arr.each_2 ( async  (el) => { 
     console.log ( "el:", el ) 
    
  },1000);
*/
