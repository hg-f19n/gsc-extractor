const markdown = require('../utils/markdown');
const { sleep } = require('../utils/wait');
const { navigateToUrl, captureScreenshot, waitAndClickByXPath } = require('../utils/navigation');

module.exports.run = async (page, siteUrl, markdownFilePath) => {
  try {
    await page.setViewport({
      width: 1400,
      height: 3000,
    });

    /**
     * Crawl Stats - Indexing
     */

    let url = `https://search.google.com/search-console/links/drilldown?resource_id=${encodeURIComponent(siteUrl)}&type=EXTERNAL&target=&domain=`;
    await navigateToUrl(page, url);

    let screenshotXPath = "//div[@role='main']";
    let result = await captureScreenshot(page, siteUrl, screenshotXPath, 'links-top-linked-pages-external');
    await markdown.generateMarkdownSlide('Links - Top linked pages - Externally', result.screenshotPath, result.pageUrl, markdownFilePath);

  } catch (error) {
    console.error(`Error in crawlStats.run: ${error}`);
  }
};
