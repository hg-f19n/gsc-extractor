const { screenshot } = require('../utils/screenshot');
const markdown = require('../utils/markdown');
const { sleep, waitForElementByXPath } = require('../utils/wait');
const { cleanUrl } = require('../utils/urls');

async function navigateToUrl(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    await sleep(1000);
  } catch (error) {
    console.error(`Failed to navigate to ${url}. ${error}`);
  }
}

async function captureScreenshot(page, siteUrl, screenshotXPath, screenshotNamePrefix) {
  let screenshotHolder, screenshotPath, pageUrl;
  try {
    screenshotHolder = await waitForElementByXPath(page, screenshotXPath);
    if (screenshotHolder) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const cleanSiteUrl = cleanUrl(siteUrl);
      const screenshotName = `${cleanSiteUrl}_${screenshotNamePrefix}_${timestamp}`;
      screenshotPath = await screenshot(screenshotHolder, screenshotName);
      pageUrl = page.url();
    } else {
      console.error(`Failed to find element with XPath "${screenshotXPath}".`);
    }
  } catch (error) {
    console.error(`Failed to capture screenshot. ${error}`);
  }
  return { screenshotPath, pageUrl };
}

module.exports.run = async (page, siteUrl, markdownFilePath) => {
  try {
    await page.setViewport({
      width: 1400,
      height: 3000,
    });

    /* =============================
       Crawl Stats Overview
       ============================= */
    let url = `https://search.google.com/search-console/settings/crawl-stats?resource_id=${encodeURIComponent(siteUrl)}`;
    await navigateToUrl(page, url);

    // Perform dropdown interactions
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

    let screenshotXPath = "//div[contains(., 'Crawl requests breakdown')]/following-sibling::div";
    let result = await captureScreenshot(page, siteUrl, screenshotXPath, 'crawl-requests-breakdown');
    await markdown.generateMarkdownSlide('Crawl Stats - Overview', result.screenshotPath, result.pageUrl, markdownFilePath);

    /* =============================
       Crawl Stats by Bot Type
       ============================= */
    let urls = [
      `https://search.google.com/search-console/settings/crawl-stats/drilldown?resource_id=${encodeURIComponent(siteUrl)}&googlebot_type=1`,
      `https://search.google.com/search-console/settings/crawl-stats/drilldown?resource_id=${encodeURIComponent(siteUrl)}&googlebot_type=2`
    ];

    let screenshotPaths = [];
    let pageUrls = [];
    for (let url of urls) {
      await navigateToUrl(page, url);
      screenshotXPath = "//c-wiz[@data-series-label-0='TOTAL_REQUESTS']";
      result = await captureScreenshot(page, siteUrl, screenshotXPath, 'crawl-requests-by-bot');
      screenshotPaths.push(result.screenshotPath);
      pageUrls.push(result.pageUrl);
    }

    await markdown.generateMarkdownSlideWithTwoImages('Crawl Stats - Googlebot Smartphone vs Desktop', 'Googlebot Smartphone', 'Googlebot Desktop', screenshotPaths[0], screenshotPaths[1], pageUrls[0], pageUrls[1], markdownFilePath);

    /* =============================
       Crawl Stats by File Type
       ============================= */
    let urls = [
      `https://search.google.com/search-console/settings/crawl-stats/drilldown?resource_id=${encodeURIComponent(siteUrl)}&googlebot_type=1`,
      `https://search.google.com/search-console/settings/crawl-stats/drilldown?resource_id=${encodeURIComponent(siteUrl)}&googlebot_type=2`
    ];

    let screenshotPaths = [];
    let pageUrls = [];
    for (let url of urls) {
      await navigateToUrl(page, url);
      screenshotXPath = "//c-wiz[@data-series-label-0='TOTAL_REQUESTS']";
      result = await captureScreenshot(page, siteUrl, screenshotXPath, 'crawl-requests-by-bot');
      screenshotPaths.push(result.screenshotPath);
      pageUrls.push(result.pageUrl);
    }

    await markdown.generateMarkdownSlideWithTwoImages('Crawl Stats - Googlebot Smartphone vs Desktop', 'Googlebot Smartphone', 'Googlebot Desktop', screenshotPaths[0], screenshotPaths[1], pageUrls[0], pageUrls[1], markdownFilePath);

  } catch (error) {
    console.error(`Error in crawlStats.run: ${error}`);
  }
};
