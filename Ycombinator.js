const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.marwadiuniversity.ac.in/", {
    waitUntil: "networkidle2",
  });
  // Saves the PDF to hn.pdf.
  await page.pdf({
    path: "MU.pdf",
    format: "A4",
    printBackground: true,
  });

  await browser.close();
})();