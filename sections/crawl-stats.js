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
    let result;
    let pageUrls;
    let screenshotPaths;

    /**
     * Crawl Stats - Indexing
     */

    url = `https://search.google.com/search-console/settings?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div/div[div[contains(text(), 'Indexing crawler')]]";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'crawl-requests-indexing-crawler');
    await markdown.generateMarkdownSlide('Crawl Stats - Indexing Crawler', result.screenshotPath, result.pageUrl, markdownFilePath);

    /**
     * Crawl Stats - Overview
     */
    url = `https://search.google.com/search-console/settings/crawl-stats?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    // Perform interactions
    const dropdownsXPath = "//div[contains(., 'Rows per page')]/following-sibling::div[@role='listbox']";
    let dropdowns;

    try {
      dropdowns = await page.$x(dropdownsXPath);
    } catch (error) {
      console.error(`Failed to find dropdowns with XPath "${dropdownsXPath}". ${error}`);
    }

    for (const dropdown of dropdowns) {
      try {
        await dropdown.click();
        await sleep(1000);

        const innerDropdownXPath = ".//div[@jsaction and @data-value='25']";
        let innerDropdown;
        try {
          innerDropdown = await dropdown.$x(innerDropdownXPath);
          if (innerDropdown.length > 0) {
            await innerDropdown[1].click();
            await sleep(1000);
          } else {
            console.error(`Failed to find inner dropdown with XPath "${innerDropdownXPath}" within the dropdown.`);
          }
        } catch (error) {
          console.error(`Failed to click inner dropdown. ${error}`);
        }
      } catch (error) {
        console.error(`Failed to click dropdown. ${error}`);
      }
    }
    // END: Perform interactions

    screenshotXPath = "//div[contains(., 'Crawl requests breakdown')]/following-sibling::div";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'crawl-requests-overview');
    await markdown.generateMarkdownSlide('Crawl Stats - Overview', result.screenshotPath, result.pageUrl, markdownFilePath);

    /**
     * Crawl Stats - by Bot Type
     */
    urls = [
      `https://search.google.com/search-console/settings/crawl-stats/drilldown?resource_id=${encodeURIComponent(siteUrl)}&googlebot_type=1`,
      `https://search.google.com/search-console/settings/crawl-stats/drilldown?resource_id=${encodeURIComponent(siteUrl)}&googlebot_type=2`
    ];

    screenshotPaths = [];
    pageUrls = [];
    for (let url of urls) {
      await navigateToUrl(page, url);
      screenshotXPath = "//c-wiz[@data-series-label-0='TOTAL_REQUESTS']";
      result = await captureScreenshot(page, siteUrl, screenshotXPath, 'crawl-requests-by-bot');
      screenshotPaths.push(result.screenshotPath);
      pageUrls.push(result.pageUrl);
    }

    await markdown.generateMarkdownSlideWithTwoImages('Crawl Stats - Googlebot Smartphone vs Desktop', 'Googlebot Smartphone', 'Googlebot Desktop', screenshotPaths[0], screenshotPaths[1], pageUrls[0], pageUrls[1], markdownFilePath);

    /**
     * Crawl Stats - by File Type - HTML & Images
     */

    urls = [
      `https://search.google.com/search-console/settings/crawl-stats/drilldown?resource_id=${encodeURIComponent(siteUrl)}&file_type=1`,
      `https://search.google.com/search-console/settings/crawl-stats/drilldown?resource_id=${encodeURIComponent(siteUrl)}&file_type=2`
    ];

    screenshotPaths = [];
    pageUrls = [];
    for (let url of urls) {
      await navigateToUrl(page, url);

      // Perform Interactions

      // Click on 'Average response time' button
      await waitAndClickByXPath(page, "//div[contains(., 'Average response time') and @role='button']");

      // Click on 'Total crawl requests' button
      await waitAndClickByXPath(page, "//div[contains(., 'Total crawl requests') and @role='button']");

      screenshotXPath = "//c-wiz[@data-series-label-0='TOTAL_REQUESTS']";
      result = await captureScreenshot(page, siteUrl, screenshotXPath, 'crawl-requests-css-js-avg-response-time');
      screenshotPaths.push(result.screenshotPath);
      pageUrls.push(result.pageUrl);
    }

    await markdown.generateMarkdownSlideWithTwoImages('Crawl Stats - Average Response Time - HTML & Images', 'HTML', 'Images', screenshotPaths[0], screenshotPaths[1], pageUrls[0], pageUrls[1], markdownFilePath);

    /**
     * Crawl Stats - by File Type - CSS & JS
     */
    urls = [
      `https://search.google.com/search-console/settings/crawl-stats/drilldown?resource_id=${encodeURIComponent(siteUrl)}&file_type=5`,
      `https://search.google.com/search-console/settings/crawl-stats/drilldown?resource_id=${encodeURIComponent(siteUrl)}&file_type=4`
    ];

    screenshotPaths = [];
    pageUrls = [];
    for (let url of urls) {
      await navigateToUrl(page, url);

      // Perform Interactions

      // Click on 'Average response time' button
      await waitAndClickByXPath(page, "//div[contains(., 'Average response time') and @role='button']");

      // Click on 'Total crawl requests' button
      await waitAndClickByXPath(page, "//div[contains(., 'Total crawl requests') and @role='button']");

      screenshotXPath = "//c-wiz[@data-series-label-0='TOTAL_REQUESTS']";
      result = await captureScreenshot(page, siteUrl, screenshotXPath, 'crawl-requests-css-js-avg-response-time');
      screenshotPaths.push(result.screenshotPath);
      pageUrls.push(result.pageUrl);
    }

    await markdown.generateMarkdownSlideWithTwoImages('Crawl Stats - Average Response Time - CSS & JS', 'CSS', 'JS', screenshotPaths[0], screenshotPaths[1], pageUrls[0], pageUrls[1], markdownFilePath);


  } catch (error) {
    console.error(`Error in crawlStats.run: ${error}`);
  }
};



/**
 * Heading
 */

// let url = `https://search.google.com/search-console/settings/crawl-stats?resource_id=${encodeURIComponent(siteUrl)}`;
// await navigateToUrl(page, url);

// Perform interactions

// let screenshotXPath = "//div[contains(., 'Crawl requests breakdown')]/following-sibling::div";
// let result = await captureScreenshot(page, siteUrl, screenshotXPath, 'crawl-requests-breakdown');
// await markdown.generateMarkdownSlide('Crawl Stats - Overview', result.screenshotPath, result.pageUrl, markdownFilePath);
