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
     * Indexing - Page Indexing - All known Pages
     */

    url = `https://search.google.com/search-console/index?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    screenshotXPaths = [
      "//div[@title='Indexed']/ancestor::c-wiz[@data-overridden-initially-visible-count]",
      "//i[contains(text(), 'info_filled')]/ancestor::div[@data-initial-page-size]"
    ];

    screenshotPaths = [];
    for (let screenshotXPath of screenshotXPaths) {
      let elements = await page.$x(screenshotXPath);
      if (elements.length > 0) {
        result = await captureScreenshot(page, siteUrl, screenshotXPath, 'indexing-pages-all-known');
        screenshotPaths.push(result.screenshotPath);
      } else {
        console.log(`Element with XPath ${screenshotXPath} not found`);
      }
    }

    await markdown.generateMarkdownSlideWithTwoImages('Indexing - Page Indexing - All known Pages', '', '', screenshotPaths[0], screenshotPaths[1], page.url(), page.url(), markdownFilePath);

    /**
     * Indexing - Page Indexing - All submitted Pages
     */

    url = `https://search.google.com/search-console/index?resource_id=${encodeURIComponent(siteUrl)}&pages=ALL_SUBMITTED_URLS&sitemap`;
    await navigateToUrl(page, url);

    screenshotXPaths = [
      "//div[@title='Indexed']/ancestor::c-wiz[@data-overridden-initially-visible-count]",
      "//i[contains(text(), 'info_filled')]/ancestor::div[@data-initial-page-size]"
    ];

    screenshotPaths = [];
    for (let screenshotXPath of screenshotXPaths) {
      let elements = await page.$x(screenshotXPath);
      if (elements.length > 0) {
        result = await captureScreenshot(page, siteUrl, screenshotXPath, 'indexing-pages-all-submitted');
        screenshotPaths.push(result.screenshotPath);
      } else {
        console.log(`Element with XPath ${screenshotXPath} not found`);
      }
    }

    await markdown.generateMarkdownSlideWithTwoImages('Indexing - Page Indexing - All submitted Pages', '', '', screenshotPaths[0], screenshotPaths[1], page.url(), page.url(), markdownFilePath);


    /**
     * Indexing - Page Indexing - Unsubmitted Pages Only
     */

    url = `https://search.google.com/search-console/index?resource_id=${encodeURIComponent(siteUrl)}&pages=ALL_NON_SUBMITTED_URLS&sitema`;
    await navigateToUrl(page, url);

    screenshotXPaths = [
      "//div[@title='Indexed']/ancestor::c-wiz[@data-overridden-initially-visible-count]",
      "//i[contains(text(), 'info_filled')]/ancestor::div[@data-initial-page-size]"
    ];

    screenshotPaths = [];
    for (let screenshotXPath of screenshotXPaths) {
      let elements = await page.$x(screenshotXPath);
      if (elements.length > 0) {
        result = await captureScreenshot(page, siteUrl, screenshotXPath, 'indexing-pages-unsubmitted-only');
        screenshotPaths.push(result.screenshotPath);
      } else {
        console.log(`Element with XPath ${screenshotXPath} not found`);
      }
    }

    await markdown.generateMarkdownSlideWithTwoImages('Indexing - Page Indexing - Unsubmitted Pages Only', '', '', screenshotPaths[0], screenshotPaths[1], page.url(), page.url(), markdownFilePath);

    /**
     * Indexing - Video Pages
     */

    url = `https://search.google.com/search-console/video-index?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div[@role='main']";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'indexing-video-pages');
    await markdown.generateMarkdownSlide('Indexing - Video Pages', result.screenshotPath, result.pageUrl, markdownFilePath);

    /**
     * Indexing - Sitemaps
     */

    url = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div[@role='main']";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'indexing-sitemaps');
    await markdown.generateMarkdownSlide('Indexing - Sitemaps', result.screenshotPath, result.pageUrl, markdownFilePath);

    /**
     * Indexing - Removals - Temporary Removals
     */

    url = `https://search.google.com/search-console/removals?resource_id=${encodeURIComponent(siteUrl)}&type=1`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div[@role='main']";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'indexing-removals-temporary');
    await markdown.generateMarkdownSlide('Indexing - Removals - Temporary Removals', result.screenshotPath, result.pageUrl, markdownFilePath);

    /**
     * Indexing - Removals - Outdated Content
     */

    url = `https://search.google.com/search-console/removals?resource_id=${encodeURIComponent(siteUrl)}&type=2`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div[@role='main']";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'indexing-removals-outdated');
    await markdown.generateMarkdownSlide('Indexing - Removals - Outdated Content', result.screenshotPath, result.pageUrl, markdownFilePath);

    /**
     * Indexing - Removals - Safesearch Filtering
     */

    url = `https://search.google.com/search-console/removals?resource_id=${encodeURIComponent(siteUrl)}&type=3`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div[@role='main']";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'indexing-removals-safesearch');
    await markdown.generateMarkdownSlide('Indexing - Removals - Safesearch Filtering', result.screenshotPath, result.pageUrl, markdownFilePath);


  } catch (error) {
    console.error(`Error in template.run: ${error}`);
  }
};
