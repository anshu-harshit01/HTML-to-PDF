const puppeteer = require("puppeteer");
const path = require("path");

(async ()=>{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    
    const filePath = `file://${path.resolve(__dirname, "index.html")}`;

    await page.goto(filePath, {waitUntil: "load"});
    await page.pdf({
        path: "formData.pdf",
        format: "A4",
        printBackground: true,
    });
    console.log("✅ PDF has been generated successfully!");
    await browser.close();
})();