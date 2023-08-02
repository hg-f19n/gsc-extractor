const markdown = require('../utils/markdown');
const { sleep, waitForElementByXPath } = require('../utils/wait');
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
     * Get all available Shopping Section URLs
     */
    url = `https://search.google.com/search-console?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    const subSectionXPath = "//div[contains(., 'Shopping') and @class and @jsname]/following-sibling::div//div[@data-scfe-feature]/a";
    let subSectionElements = await page.$x(subSectionXPath);

    // If the Shopping section does not exist, log to console and exit
    if (subSectionElements.length === 0) {
      console.log('No Shopping section found.');
      return;
    }

    let subSectionUrls = [];

    for (let element of subSectionElements) {
      let href = await page.evaluate(el => el.getAttribute('href'), element);
      const baseUrl = "https://search.google.com/";
      subSectionUrls.push(new URL(href, baseUrl));
    }

    /**
     * Visit and generate markdown
     */
    for (let subSectionUrl of subSectionUrls) {
      await navigateToUrl(page, subSectionUrl);
      let heading = await page.$x("//div[@role='main']//span[@role='heading']");
      let headingText = await page.evaluate(element => element.textContent, heading[0]);
      let headingTextSanitized = headingText.toLowerCase().replace(/ /g, "-");
      screenshotXPath = "//div[@role='main']";
      result = await captureScreenshot(page, siteUrl, screenshotXPath,  `shopping-${headingTextSanitized}`);
      await markdown.generateMarkdownSlide(`Shopping - ${headingText}`, result.screenshotPath, result.pageUrl, markdownFilePath);
      await sleep(500);
    }

  } catch (error) {
    console.error(`Error in enhancements.run: ${error}`);
  }
};
