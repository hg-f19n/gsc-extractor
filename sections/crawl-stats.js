const puppeteer = require('puppeteer');
const { screenshot } = require('../utils/screenshot');
const markdown = require('../utils/markdown');
const { sleep, waitForElementByXPath } = require('../utils/wait');

module.exports.run = async (page, siteUrl) => {
  try {
    const url = `https://search.google.com/search-console/settings/crawl-stats?resource_id=${encodeURIComponent(siteUrl)}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
    } catch (error) {
      console.error(`Failed to navigate to ${url}. ${error}`);
    }

    await sleep(2000);

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

    const breakdownXPath = "//div[contains(., 'Crawl requests breakdown')]/following-sibling::div";
    let breakdown;
    try {
      breakdown = await waitForElementByXPath(page, breakdownXPath);
      if (breakdown) {
        const timestamp = new Date().toISOString();
        const cleanSiteUrl = siteUrl.replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,'');
        const screenshotName = `${cleanSiteUrl}_crawl-requests-breakdown_${timestamp}`;
        await screenshot(breakdown, screenshotName);
      } else {
        console.error(`Failed to find breakdown with XPath "${breakdownXPath}".`);
      }
    } catch (error) {
      console.error(`Failed to capture screenshot. ${error}`);
    }

  } catch (error) {
    console.error(`Error in crawlStats.run: ${error}`);
  }
  //test slack github
};
