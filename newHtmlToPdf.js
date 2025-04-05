const express = require("express");
const multer = require("multer");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: "uploads/" });

app.post("/generate-pdf", upload.single("htmlfile"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "File is not uploaded successfully" });
    }

    // ✅ Dynamically fetch width and height from form-data fields
    const width = req.body.width || "10cm";
    const height = req.body.height || "20cm";

    const htmlFilePath = path.resolve(req.file.path);
    const htmlFileContent = fs.readFileSync(htmlFilePath, "utf-8");

    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
      headless: "new",
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 900 });
    await page.setContent(htmlFileContent, { waitUntil: "load" });

    // await page.waitForFunction(() => new Promise(resolve => setTimeout(resolve, 3000)));

    // Debug to check rendered HTML
    const renderedHTML = await page.evaluate(
      () => document.documentElement.outerHTML
    );
    //console.log(renderedHTML); // Inspect this output for issues
    // Debug to check rendered HTML
    // const renderedHTML = await page.evaluate(
    //   () => document.documentElement.outerHTML
    // );
    // console.log(renderedHTML);

    // Wait for dynamic content to load
    //await page.waitForTimeout(3000);

    const pdfPath = path.join(__dirname, "generatedPdf.pdf");
    await page.pdf({
      path: pdfPath,
      //format: "A4",
      width,
      height,
      // width:
      //   (await page.evaluate(() => document.documentElement.scrollWidth)) +
      //   "px",
      // height:
      //   (await page.evaluate(() => document.documentElement.scrollHeight)) +
      //   "px",
      printBackground: true,
      landscape: false,
    });

    await browser.close();

    res.download(pdfPath, "generatedPdf.pdf", (err) => {
      if (err) {
        console.log("Occurred error: ", err);
        return res.status(500).json({ error: "Failed to download PDF" });
      }
      fs.unlinkSync(htmlFilePath);
      fs.unlinkSync(pdfPath);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
