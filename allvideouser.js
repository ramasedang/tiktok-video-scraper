const { url } = require("inspector");
const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth")();
const fs = require("fs");
const https = require("https");

["chrome.runtime", "navigator.languages"].forEach((a) =>
  stealthPlugin.enabledEvasions.delete(a)
);

puppeteer.use(stealthPlugin);

main();
async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
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

  const userLink = "https://www.tiktok.com/@christnkls";
  await page.goto(userLink);

  let username = page
    .url()
    .slice(23)
    .replace(/[-:.\/*<>|?]/g, "");

  await autoScroll(page);
  let urlArr = [];
  const urls = await page.$$eval(
    "div.tiktok-1qb12g8-DivThreeColumnContainer > div > div > div > div > div > a",
    (elements) => elements.map((element) => element.href)
  );

  urlArr.push(...urls);

  fs.writeFileSync("urls.json", JSON.stringify(urlArr));

  const videoDes = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        "div.tiktok-1qb12g8-DivThreeColumnContainer.eegew6e2 > div > div > div > a"
      )
    ).map((items) => items.innerText + " #shorts\r\n")
  );

  fs.appendFile("names.txt", videoDes.join(""), function (err) {
    if (err) throw err;
    console.log("Descriptions Saved!");
  });

  console.log("now downloading " + urls.length + " videos");

  const path = `./${username}/`;

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  for (let i = 0; i < urls.length; i++) {
    await downloadVideo(page, urls[i], path);
  }

  browser.close();
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function downloadVideo(page, url, path) {
  const waitForRandomTime = () =>
    page.waitForTimeout(Math.floor(Math.random() * (500 - 300 + 1)) + 300);
  const waitForHighTime = () =>
    page.waitForTimeout(Math.floor(Math.random() * (500 - 300 + 1)) + 1150);

  await waitForHighTime();
  await page.goto("https://snaptik.app/");
  await waitForRandomTime();
  await page.waitForSelector('input[name="url"]');
  await page.type('input[name="url"]', url, { delay: 50 });
  await waitForRandomTime();
  await page.click("#hero > div > form > button");
  await waitForHighTime();

  const [downloadLink] = await page.$x('//*[@id="download"]/div/div[2]/a[1]');
  const videoURL = await page.evaluate((el) => el.href, downloadLink);

  const fileName = url.slice(-19) + ".mp4";
  const filePath = path + fileName;

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
}
