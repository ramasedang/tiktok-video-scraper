const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth")();
const fs = require("fs");
const https = require("https");
const prompts = require("prompts");

["chrome.runtime", "navigator.languages"].forEach((a) =>
  stealthPlugin.enabledEvasions.delete(a)
);

puppeteer.use(stealthPlugin);

(async () => {
  const main = async () => {
    const { value: link } = await prompts({
      type: "text",
      name: "value",
      message: "Enter the link of the user you want to download",
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-web-security",
      ],
    });

    const page = await browser.newPage();

    await page.evaluateOnNewDocument(() => {
      delete navigator.__proto__.webdriver;
    });

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (["image", "stylesheet", "font"].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    const waitForRandomTime = () =>
      page.waitForTimeout(Math.floor(Math.random() * (500 - 300 + 1)) + 300);
    const waitForHighTime = () =>
      page.waitForTimeout(Math.floor(Math.random() * (500 - 300 + 1)) + 1150);

    await waitForHighTime();
    await page.goto("https://snaptik.app/");
    await waitForRandomTime();
    await page.waitForSelector('input[name="url"]');
    await page.type('input[name="url"]', link, { delay: 50 });
    await waitForRandomTime();
    await page.click("#hero > div > form > button");
    await waitForHighTime();

    const [downloadLink] = await page.$x('//*[@id="download"]/div/div[2]/a[1]');
    const videoURL = await page.evaluate((el) => el.href, downloadLink);

    const fileName = link.slice(-19) + ".mp4";
    const outputDir = "./SingleVideos";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const filePath = outputDir + "/" + fileName;

    const request = https.get(videoURL, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filePath);
        response.pipe(file);
        console.log(filePath + " Saved!");
        fs.appendFile("names.txt", filePath + "\r\n", (err) => {
          if (err) throw err;
          console.log("Done");
        });
      }
    });

    await browser.close();
  };

  await main();
})();
