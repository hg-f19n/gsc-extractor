const { sleep, waitForElementByXPath } = require('./wait');
const { cleanUrl } = require('../utils/urls');
const { screenshot } = require('../utils/screenshot');


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

async function waitAndClickByXPath(page, xpath) {
    try {
        const element = await waitForElementByXPath(page, xpath);
        if (element) {
            await element.click();
            await sleep(1000);
        } else {
            console.error(`Cannot find element with XPath: ${xpath}`);
        }
    } catch (error) {
        console.error(`Error in waitAndClickByXPath: ${error}`);
    }
}

module.exports = {
    navigateToUrl,
    captureScreenshot,
    waitAndClickByXPath
};
