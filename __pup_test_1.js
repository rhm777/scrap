const puppeteer = require("puppeteer")
async function run (){
    let exe_path = "C://Program Files (x86)//Google//Chrome//Application//chrome.exe"
    
const browser = await puppeteer.launch({
    args: ['--no-sandbox'],executablePath:exe_path
});
}
run ()