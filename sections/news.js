const markdown = require('../utils/markdown');
const { sleep } = require('../utils/wait');
const { navigateToUrl, captureScreenshot, waitAndClickByXPath } = require('../utils/navigation');

module.exports.run = async (page, siteUrl, markdownFilePath) => {
  try {
    await page.setViewport({
      width: 1400,
      height: 3000,
    });

    let url;
    let urls;
    let screenshotXPath;
    let screenshotXPaths;
    let result;
    let pageUrls;
    let screenshotPaths;

    /**
     * Check if Google News Section exists
     */
    url = `https://search.google.com/search-console?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    const checkXPath = "//div[@data-text='Google News']";
    let checkSection = await page.$x(checkXPath);

    // If the section does not exist, log to console and exit
    if (checkSection.length === 0) {
      console.log('No Google News section found.');
      return;
    }

    /**
     * Discover - Clicks - Last 28 Days
     */
    url = `https://search.google.com/search-console/performance/google-news?resource_id=${encodeURIComponent(siteUrl)}&metrics=CLICKS&num_of_days=28`;
    await navigateToUrl(page, url);

    screenshotXPaths = [
      "//div[@title='Total clicks']/ancestor::c-wiz[@data-overridden-initially-visible-count]",
      "//div[contains(text(), 'Queries')]/ancestor::div[@jscontroller and @jsaction and @jsshadow and @jsname]"
    ];

    screenshotPaths = [];
    for (let screenshotXPath of screenshotXPaths) {
      let elements = await page.$x(screenshotXPath);
      if (elements.length > 0) {
        result = await captureScreenshot(page, siteUrl, screenshotXPath, 'news-clicks-28-days');
        screenshotPaths.push(result.screenshotPath);
      } else {
        console.log(`Element with XPath ${screenshotXPath} not found`);
      }
    }

    await markdown.generateMarkdownSlideWithTwoImages('Google News - Clicks - Last 28 Days', '', '', screenshotPaths[0], screenshotPaths[1], page.url(), page.url(), markdownFilePath);

    /**
     * Discover - Clicks - Last 16 Months
     */

    url = `https://search.google.com/search-console/performance/google-news?resource_id=${encodeURIComponent(siteUrl)}&metrics=CLICKS&num_of_months=16`;
    await navigateToUrl(page, url);

    screenshotXPaths = [
      "//div[@title='Total clicks']/ancestor::c-wiz[@data-overridden-initially-visible-count]",
      "//div[contains(text(), 'Queries')]/ancestor::div[@jscontroller and @jsaction and @jsshadow and @jsname]"
    ];

    screenshotPaths = [];
    for (let screenshotXPath of screenshotXPaths) {
      let elements = await page.$x(screenshotXPath);
      if (elements.length > 0) {
        result = await captureScreenshot(page, siteUrl, screenshotXPath, 'news-clicks-16-months');
        screenshotPaths.push(result.screenshotPath);
      } else {
        console.log(`Element with XPath ${screenshotXPath} not found`);
      }
    }

    await markdown.generateMarkdownSlideWithTwoImages('Google News - Clicks - Last 16 Months', '', '', screenshotPaths[0], screenshotPaths[1], page.url(), page.url(), markdownFilePath);

  } catch (error) {
    console.error(`Error in news.run: ${error}`);
  }
};