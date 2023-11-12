/*
   now , move this pstr to scrap folder for testing.
   using dont submit =0
   then use dont submit = 1.
   note this is used as unit worker.
   and only run is invoked.
*/

//const puppeteer = require('puppeteer');
const {puppeteer_base} = require('./puppeteer_base')

base_url = "https://twitter.com/home"
        
class twtr_pstr
{
    constructor ( visible , dont_submit=1 )
    {
        this.visible    = visible
        this.pup_base   = new puppeteer_base(visible)
        this.dont_submit = dont_submit
    }
    async load_page ( url )
    {
        await this.pup_base.create_browser()
        this.page    =   await this.pup_base.get_new_page ( url )
        console.log ( "page.title: " + await this.page.title() )
        this.page.setViewport({ width: 1218, height: 583 })
    }

    async run(  message ) 
    {
        let reload = 0;
        if ( message === undefined )
            throw new Error("message is undefined...")

        let title   = message["title"]
        let content = message["content"]
        let descr   = message["description"]        
        
        if ( content.length < 2 )
            throw new Error("content length is < 2")
        // scan_def gives count.
        console.log ( "scanner_base.run")
        let page = this.page
        
        if ( this.dont_submit == 1 || reload == 1){
             //page.reload()
             page.goto(base_url, {timeout:100000})
             reload = 0
        }
        
        let sel = "[data-testid=tweetTextarea_0] > div > div > div"
        await page.waitForSelector(sel,{timeout:60000})
        await page.click ( sel )
        await page.type  ( sel , content[0] )
        await page.type  ( sel , content.substring(1,content.length))
        let add_photos_sel  =  "div[aria-label='Add photos or video']"
        let path = await process.cwd() + "/image_1.jpg"
        console.log ( path )
        console.log (   `*******************cwd "${process.cwd()}" *******` )
        
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(add_photos_sel)
          ]); 
        await fileChooser.accept(['image_1.jpg','image_2.jpg','image_3.jpg']);

        let pst_btn_sel = '[data-testid=tweetButtonInline] > div > span > span'
        await page.waitForSelector ( pst_btn_sel )
        await page.hover ( pst_btn_sel )
        if ( this.dont_submit != 1 )
            await page.click ( pst_btn_sel )   // do submit the post.
        console.log ( "dismissing...")
        //await page.waitForTimeout(8000)
        if ( this.dont_submit != 1 ){
        let pst_btn_dsms_sel = '#layers > div.css-1dbjc4n.r-aqfbo4.r-1d2f490.r-12vffkv.r-1xcajam.r-zchlnj.r-ipm5af > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-1kihuf0.r-18u37iz.r-1pi2tsx.r-1777fci.r-1pjcn9w.r-xr3zp9.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-14lw9ot.r-1867qdf.r-1jgb5lz.r-pm9dpa.r-1ye8kvj.r-1rnoaur.r-13qz1uu > div > div.css-1dbjc4n.r-1h3ijdo.r-136ojw6 > div > div > div > div.css-1dbjc4n.r-1habvwh.r-1pz39u2.r-1777fci.r-15ysp7h.r-s8bhmr > div > div > svg > g > path'
        try{
            await page.waitForSelector ( pst_btn_dsms_sel )
            await page.hover ( pst_btn_dsms_sel )
            await page.click ( pst_btn_dsms_sel )
            console.log ( "dismissed...")
        }catch(TimeoutError)
        {
            console.log ("unsable to select: " + pst_btn_dsms_sel)
            reload=1
        }
        }
    }
    async close ()
    {
        if ( this.page != null )
            await this.page.close()
    }
}

async function runner()
{
    messages = [
                {"title":"twitter post test_0","content":"this is a test content_0..."},
                {"title":"twitter post test_1","content":"this is a test content_1..."},
                {"title":"twitter post test_2","content":"this is a test content_2..."},
                {"title":"twitter post test_3","content":"this is a test content_3..."}
                
               ]
    sb = new twtr_pstr()
    await sb.load_page ( base_url )
    await sb.run(messages[0])
    console.log ( "done running....message_0")
    await sb.run(messages[1])
    console.log ( "done running....message_1")
    await sb.run(messages[2])
    console.log ( "done running....message_2")
    await sb.run(messages[3])
    console.log ( "done running....message_3")
}
//runner()

module.exports = { twtr_pstr }