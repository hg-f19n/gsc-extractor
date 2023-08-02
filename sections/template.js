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
     * Sub Section Title - Default Slide
     */

    url = `?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    // Perform Interactions
    // Click on 'Average response time' button
    await waitAndClickByXPath(page, "//div[contains(., 'Average response time') and @role='button']");

    screenshotXPath = "";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, '__title__');
    await markdown.generateMarkdownSlide('__slideTitle__', result.screenshotPath, result.pageUrl, markdownFilePath);

    /**
     * Sub Section Title - Split Slide
     */
    urls = [
      `?resource_id=${encodeURIComponent(siteUrl)}`,
      `?resource_id=${encodeURIComponent(siteUrl)}`
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


  } catch (error) {
    console.error(`Error in template.run: ${error}`);
  }
};
