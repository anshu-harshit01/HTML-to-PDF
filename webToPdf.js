//launch Chromium..
const puppeteer = require("puppeteer");
// import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: true, product:"Firefox"});
  const page = await browser.newPage();
  await page.goto("https://search.brave.com/", {
    waitUntil: "domcontentloaded",
  });

  //selector humko khud se dekhna hoota hai har browser ke liye..
  let searchBoxSelector = "textarea#searchbox, input#searchbox";
  await page.waitForSelector(searchBoxSelector, { visible: true });

  //search box khoz ke usme input data enter kar dega.
  await page.type(searchBoxSelector, "W3Schools");
  await page.keyboard.press("Enter");
  await new Promise(resolve => setTimeout(resolve, 3000));

  //pdf generate karenge
  await page.pdf({
    path: "Brave_Search_Result.pdf",
    format: "A4",
    printBackground: true,
  });
  console.log("PDF has been generated successfully!");
  browser.close();
})();