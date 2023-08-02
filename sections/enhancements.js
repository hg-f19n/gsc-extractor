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
     * Get all available Enhancement Section URLs
     */
    url = `https://search.google.com/search-console?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    const enhancementSectionsXPath = "//div[contains(., 'Enhancements') and @class and @jsname]/following-sibling::div//div[@data-scfe-feature]/a";
    let enhancementSectionElements = await page.$x(enhancementSectionsXPath);

    // If the Enhancements section does not exist, log to console and exit
    if (enhancementSectionElements.length === 0) {
      console.log('No Enhancements section found.');
      return;
    }

    let enhancementSectionUrls = [];

    for (let element of enhancementSectionElements) {
      let href = await page.evaluate(el => el.getAttribute('href'), element);
      const baseUrl = "https://search.google.com/";
      enhancementSectionUrls.push(new URL(href, baseUrl));
    }

    /**
     * Visit and generate markdown
     */
    for (let enhancementSectionUrl of enhancementSectionUrls) {
      await navigateToUrl(page, enhancementSectionUrl);
      let heading = await page.$x("//div[@role='main']//span[@role='heading']");
      let headingText = await page.evaluate(element => element.textContent, heading[0]);
      let headingTextSanitized = headingText.toLowerCase().replace(/ /g, "-");
      screenshotXPath = "//div[@role='main']";
      result = await captureScreenshot(page, siteUrl, screenshotXPath,  `enhancement-${headingTextSanitized}`);
      await markdown.generateMarkdownSlide(`Enhancements - ${headingText}`, result.screenshotPath, result.pageUrl, markdownFilePath);
      await sleep(500);
    }

  } catch (error) {
    console.error(`Error in enhancements.run: ${error}`);
  }
};
