//adding Puppeteer library
const pt = require('puppeteer');
let data_dir  = "C://Users//xyz//AppData//Local//Google//Chrome//User Data//"
let exe_path = "C://Program Files (x86)//Google//Chrome//Application//chrome.exe"
                
pt.launch({ignoreDefaultArgs: ['--enable-automation'],executablePath:exe_path,userDataDir:data_dir,headless:false}).then(async browser => {
    {waitUntil: ['domcontentloaded']}

    //browser new page
console.log ( "opening browser ...")
const p = await browser.newPage();
p.setDefaultNavigationTimeout(0)
console.log ( "title: " + await p.title())
//set viewpoint of browser page
await p.setViewport({ width: 1000, height: 500 })
//launch URL
//await p.goto('https://bstackdemo.com')
//await p.goto('https://www.yahoo.com');//,{timeout:100000,waitUntil: ['domcontentloaded']})
await p.goto('https://www.twitter.com/home');

//capture screenshot
//await p.screenshot({
//path: 'browserstack-demo.png'
//});
await p.waitForTimeout(10000000)
//browser close
await browser.close()
})