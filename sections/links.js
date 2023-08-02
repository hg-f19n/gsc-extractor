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
     * Links External - Top linked Pages
     */

    url = `https://search.google.com/search-console/links/drilldown?resource_id=${encodeURIComponent(siteUrl)}&type=EXTERNAL&target=&domain=`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div[@role='main']";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'links-top-linked-pages-external');
    await markdown.generateMarkdownSlide('External Links - Top linked pages', result.screenshotPath, result.pageUrl, markdownFilePath);

    /**
     * Links External - Top Linking Sites
     */

    url = `https://search.google.com/search-console/links/drilldown?resource_id=${encodeURIComponent(siteUrl)}&type=DOMAIN&target=&domain=`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div[@role='main']";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'links-top-linking-sites-external');
    await markdown.generateMarkdownSlide('External Links - Top Linking Sites', result.screenshotPath, result.pageUrl, markdownFilePath);
    
    /**
     * Links External - Top Linking Text
     */

    url = `https://search.google.com/search-console/links/drilldown?resource_id=${encodeURIComponent(siteUrl)}&type=ANCHOR_TEXT&target=&domain=`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div[@role='main']";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'links-top-linking-text-external');
    await markdown.generateMarkdownSlide('External Links - Top Linking Text', result.screenshotPath, result.pageUrl, markdownFilePath);

    /**
     * Links Internal - Top Linked Pages
     */

    url = `https://search.google.com/search-console/links/drilldown?resource_id=${encodeURIComponent(siteUrl)}&type=INTERNAL&target=&domain=`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div[@role='main']";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'links-top-linked-pages-internal');
    await markdown.generateMarkdownSlide('Internal Links - Top Linked Pages', result.screenshotPath, result.pageUrl, markdownFilePath);


  } catch (error) {
    console.error(`Error in links.run: ${error}`);
  }
};