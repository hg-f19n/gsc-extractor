const puppeteer = require("puppeteer");
const readline = require("readline");
//const crawlStats = require('./sections/crawl-stats');
//const indexing = require('./sections/indexing');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // navigate to Google's login page for manual login
  await page.goto("https://accounts.google.com/signin");

  await new Promise((resolve, reject) => {
    rl.question(
      "Please login to your Google account in the browser then press Enter to continue...",
      function (answer) {
        resolve();
      }
    );
  });

  await page.goto("https://search.google.com/search-console/about");

  console.log("login successful");

  // Running section scripts
  //await crawlStats.run(page);
  //await indexing.run(page);

  rl.close();
  await browser.close();
})();
