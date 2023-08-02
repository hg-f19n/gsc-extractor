const markdown = require('../utils/markdown');
const { sleep } = require('../utils/wait');
const { navigateToUrl, captureScreenshot, waitAndClickByXPath } = require('../utils/navigation');

module.exports.run = async (page, siteUrl, markdownFilePath) => {
  try {
    await page.setViewport({
      width: 1400,
      height: 700,
    });

    let url;
    let urls;
    let screenshotXPath;
    let result;
    let pageUrls;
    let screenshotPaths;

    /**
     * Manual Actions
     */

    url = `https://search.google.com/search-console/manual-actions?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div[@role='main']";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'manual-actions');
    await markdown.generateMarkdownSlide('Manual Actions', result.screenshotPath, result.pageUrl, markdownFilePath);

    /**
     * Security Issues
     */

    url = `https://search.google.com/search-console/security-issues?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    screenshotXPath = "//div[@role='main']";
    result = await captureScreenshot(page, siteUrl, screenshotXPath, 'security-issues');
    await markdown.generateMarkdownSlide('Security Issues', result.screenshotPath, result.pageUrl, markdownFilePath);

  } catch (error) {
    console.error(`Error in securityActions.run: ${error}`);
  }
};
