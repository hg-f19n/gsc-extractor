const puppeteer = require("puppeteer");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Go to Google login page
  await page.goto("https://accounts.google.com/signin/v2/identifier");

  // Wait for user to manually login
  await new Promise((resolve) =>
    readline.question("After logging in, press ENTER to continue.", resolve)
  );

  // Replace 'your-console-url' with the console URL you want to capture
  await page.goto(
    "https://search.google.com/search-console/settings/crawl-stats?resource_id=https%3A%2F%2Fwww.fullstackoptimization.com%2F&hl=en"
  );
  await page.screenshot({ path: "console.png" });

  readline.close();
  await browser.close();
})();
