const puppeteer = require('puppeteer');
class puppeteer_base
{
    constructor ( visible=true, width=0 , height=0 )
    {
        this.visible = visible
        this.width   = width
        this.height  = height
    }
    
    async get_tab_count()
    {
        const numberOfOpenPages = (await this.browser.pages()).length
        return numberOfOpenPages;
    }

    async create_browser ( )
    {
        let exe_path = "C://Program Files (x86)//Google//Chrome//Application//chrome.exe"
        let data_dir  = "C://Users//xyz//AppData//Local//Google//Chrome//User Data//"
        //let exe_path = "/opt/google/chrome/google-chrome"
        //let data_dir = "/home/xyz/.config/google-chrome/Default"

        this.browser = await puppeteer.launch ( 
            { ignoreDefaultArgs: ['--enable-automation'],args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"],headless:!this.visible, executablePath:exe_path, userDataDir:data_dir} )
   
    }
    async get_new_page ( url )
    {
        let page = await this.browser.newPage()
        //await page.setExtraHTTPHeaders({ 
           // 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 
           // 'upgrade-insecure-requests': '1', 
          //  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
          //  'accept-encoding': 'gzip, deflate, br', 
          //  'accept-language': 'en-US,en;q=0.9,en;q=0.8' 
        //});
        console.log ( "--new page loaded for url:" + url + "---" + await page.title())
        page.setDefaultNavigationTimeout ( 0 )
        await page.goto ( url  )
        this.page = await page
        return page
    }

    async delay(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
     }
}

module.exports  = {puppeteer_base}