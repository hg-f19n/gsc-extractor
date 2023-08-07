const markdown = require('../utils/markdown');
const { sleep } = require('../utils/wait');
const { navigateToUrl, captureScreenshot, waitAndClickByXPath } = require('../utils/navigation');

module.exports.run = async (page, siteUrl, markdownFilePath, brandName = null) => {
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

    let brandUrl = new URL(siteUrl);
    let brand = brandName || brandUrl.hostname.split('.').slice(1, -1).join('.');

    /**
     * Performance - Clicks - Last 28 Days
     */

    url = `https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(siteUrl)}&metrics=CLICKS&num_of_days=28`;
    await navigateToUrl(page, url);

    screenshotXPaths = [
      "//div[@title='Total clicks']/ancestor::c-wiz[@data-overridden-initially-visible-count]",
      "//div[contains(text(), 'Queries')]/ancestor::div[@jscontroller and @jsaction and @jsshadow and @jsname]"
    ];

    screenshotPaths = [];
    for (let screenshotXPath of screenshotXPaths) {
      let elements = await page.$x(screenshotXPath);
      if (elements.length > 0) {
        result = await captureScreenshot(page, siteUrl, screenshotXPath, 'performance-clicks-28-days');
        screenshotPaths.push(result.screenshotPath);
      } else {
        console.log(`Element with XPath ${screenshotXPath} not found`);
      }
    }

    await markdown.generateMarkdownSlideWithTwoImages('Performance - Clicks - Last 28 Days', '', '', screenshotPaths[0], screenshotPaths[1], page.url(), page.url(), markdownFilePath);

    /**
     * Performance - Clicks - Last 16 Months
     */

    url = `https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(siteUrl)}&metrics=CLICKS&num_of_months=16`;
    await navigateToUrl(page, url);

    screenshotXPaths = [
      "//div[@title='Total clicks']/ancestor::c-wiz[@data-overridden-initially-visible-count]",
      "//div[contains(text(), 'Queries')]/ancestor::div[@jscontroller and @jsaction and @jsshadow and @jsname]"
    ];

    screenshotPaths = [];
    for (let screenshotXPath of screenshotXPaths) {
      let elements = await page.$x(screenshotXPath);
      if (elements.length > 0) {
        result = await captureScreenshot(page, siteUrl, screenshotXPath, 'performance-clicks-16-months');
        screenshotPaths.push(result.screenshotPath);
      } else {
        console.log(`Element with XPath ${screenshotXPath} not found`);
      }
    }

    await markdown.generateMarkdownSlideWithTwoImages('Performance - Clicks - Last 16 Months', '', '', screenshotPaths[0], screenshotPaths[1], page.url(), page.url(), markdownFilePath);

    /**
     * Performance - Clicks - Branded vs Unbranded
     */

    urls = [
      `https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(siteUrl)}&metrics=CLICKS&num_of_days=28&query=*${brand}`,
      `https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(siteUrl)}&metrics=CLICKS&num_of_days=28&query=-${brand}`
    ];

    screenshotPaths = [];
    pageUrls = [];
    for (let url of urls) {
      await navigateToUrl(page, url);
      screenshotXPath = "//div[@title='Total clicks']/ancestor::c-wiz[@data-overridden-initially-visible-count]";
      result = await captureScreenshot(page, siteUrl, screenshotXPath, 'performance-clicks-branded-unbranded');
      screenshotPaths.push(result.screenshotPath);
      pageUrls.push(result.pageUrl);
    }

    await markdown.generateMarkdownSlideWithTwoImages('Performance - Clicks - Branded vs Unbranded', `Branded - Includes "${brand}"`, `Unbranded - Does not include "${brand}"`, screenshotPaths[0], screenshotPaths[1], pageUrls[0], pageUrls[1], markdownFilePath);

    /**
     * Performance - Clicks - Branded
     */

    url = `https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(siteUrl)}&metrics=CLICKS&num_of_days=28&query=*${brand}`;
    await navigateToUrl(page, url);

    screenshotXPaths = [
      "//div[@title='Total clicks']/ancestor::c-wiz[@data-overridden-initially-visible-count]",
      "//div[contains(text(), 'Queries')]/ancestor::div[@jscontroller and @jsaction and @jsshadow and @jsname]"
    ];

    screenshotPaths = [];
    for (let screenshotXPath of screenshotXPaths) {
      let elements = await page.$x(screenshotXPath);
      if (elements.length > 0) {
        result = await captureScreenshot(page, siteUrl, screenshotXPath, 'performance-clicks-branded');
        screenshotPaths.push(result.screenshotPath);
      } else {
        console.log(`Element with XPath ${screenshotXPath} not found`);
      }
    }

    await markdown.generateMarkdownSlideWithTwoImages(`Performance - Clicks - Branded - Includes "${brand}"`, '', '', screenshotPaths[0], screenshotPaths[1], page.url(), page.url(), markdownFilePath);

    /**
     * Performance - Clicks - Unbranded
     */

    url = `https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(siteUrl)}&metrics=CLICKS&num_of_days=28&query=-${brand}`;
    await navigateToUrl(page, url);

    screenshotXPaths = [
      "//div[@title='Total clicks']/ancestor::c-wiz[@data-overridden-initially-visible-count]",
      "//div[contains(text(), 'Queries')]/ancestor::div[@jscontroller and @jsaction and @jsshadow and @jsname]"
    ];

    screenshotPaths = [];
    for (let screenshotXPath of screenshotXPaths) {
      let elements = await page.$x(screenshotXPath);
      if (elements.length > 0) {
        result = await captureScreenshot(page, siteUrl, screenshotXPath, 'performance-clicks-unbranded');
        screenshotPaths.push(result.screenshotPath);
      } else {
        console.log(`Element with XPath ${screenshotXPath} not found`);
      }
    }

    await markdown.generateMarkdownSlideWithTwoImages(`Performance - Clicks - Unbranded - Does not include "${brand}"`, '', '', screenshotPaths[0], screenshotPaths[1], page.url(), page.url(), markdownFilePath);


  } catch (error) {
    console.error(`Error in performance.run: ${error}`);
  }
};