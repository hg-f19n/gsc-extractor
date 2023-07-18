const puppeteer = require("puppeteer");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

let siteUrl = "";

readline.question("Enter your site URL: ", async (url) => {
  siteUrl = encodeURIComponent(url);
  readline.close();

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Go to Google login page
    await page.goto("https://accounts.google.com/signin/v2/identifier");

    console.log("You have 2 minutes to login.");

    // Wait for user to login or timeout after 2 minutes
    await Promise.race([
      page.waitForNavigation(), // waits for the page to load
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout after 2 minutes")), 120000)
      ), // 2 minute timeout
    ]);

    // Replace 'your-console-url' with the console URL you want to capture
    const crawlStatsUrl = `https://search.google.com/search-console/settings/crawl-stats/drilldown?resource_id=${siteUrl}&file_type=1&hl=en`;
    await page.goto(crawlStatsUrl);

    const waitForElementByXPath = async (xpath, timeout = 120000) => {
      const element = await page.waitForXPath(xpath, { timeout });
      return element;
    };

    // Click on 'Average response time' button
    const responseTimeButton = await waitForElementByXPath(
      "//div[contains(., 'Average response time') and @role='button']"
    );
    if (responseTimeButton) {
      await responseTimeButton.click();
    } else {
      throw new Error("Cannot find 'Average response time' button.");
    }

    // Add a delay to let the page load
    await page.waitForTimeout(2000); // Wait for 2 seconds

    // Click on 'Total crawl requests' button
    const totalCrawlRequestsButton = await waitForElementByXPath(
      "//div[contains(., 'Total crawl requests') and @role='button']"
    );
    if (totalCrawlRequestsButton) {
      await totalCrawlRequestsButton.click();
    } else {
      throw new Error("Cannot find 'Total crawl requests' button.");
    }

    // Add a delay to let the page load
    await page.waitForTimeout(2000); // Wait for 2 seconds

    // Take screenshot of the specific element
    const element = await page.$(
      '[data-scorecard-title-0="Total crawl requests"]'
    );
    if (element) {
      await element.screenshot({ path: "crawlStats.png" });
    } else {
      throw new Error(
        "Cannot find element with 'data-scorecard-title-0=\"Total crawl requests\"'."
      );
    }

    await browser.close();
  } catch (error) {
    console.error("An error occurred: ", error);
  }
});
