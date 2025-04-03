const puppeteer = require("puppeteer");
console.log("Before");
let page;
let browserOpen = puppeteer.launch({headless:false});
browserOpen
.then(function(browser){
    //currently opened tabs
    const pagesArrPromise = browser.pages();
    return pagesArrPromise;
}).then(function (browserPages){
    //jo page array hoga uska first element me humara target page hoga.
    page = browserPages[0];
    let gotoPromise = page.goto("https://search.brave.com/");
    return gotoPromise;
}).then(function (){
    let searchBoxSelector = "textarea#searchbox, input#searchbox";
    let elementWaitPromise = page.waitForSelector(searchBoxSelector, {visible: true});
    return elementWaitPromise;
}).then(function(){
    let searchBoxSelector = "textarea#searchbox, input#searchbox";
    let keyWillBeSendPromise = page.type(searchBoxSelector, "W3Schools");
    return keyWillBeSendPromise;
}).then(function(){
    let enterWillBePressed = page.keyboard.press("Enter");
    return enterWillBePressed;
}).catch(function(err){
    console.log(err);
});
console.log("After");