module.exports.sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports.waitForElementByXPath = async (page, xpath, timeout = 120000) => {
    try {
        const element = await page.waitForXPath(xpath, { timeout });
        return element;
    } catch (error) {
        console.error(`Error waiting for element by XPath: ${error}`);
        return null;
    }
};