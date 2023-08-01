const path = require('path');

module.exports.screenshot = async (elementOrPage, screenshotName, padding = 20, maxHeight = 1200) => {
  try {
    const screenshotPath = path.resolve(__dirname, '../screenshots', `${screenshotName}.png`);

    // Check if it's a Page object
    if (elementOrPage.constructor.name === 'Page') {
      await elementOrPage.screenshot({ path: screenshotPath, fullPage: true });
    } 
    // Check if it's an ElementHandle object
    else if (elementOrPage.constructor.name === 'ElementHandle' || elementOrPage.constructor.name === 'CDPElementHandle') {
      const box = await elementOrPage.boundingBox();

      // adjust position and size with padding
      const paddedBox = {
        x: box.x - padding,
        y: box.y - padding,
        width: box.width + padding * 2,
        height: Math.min(box.height + padding * 2, maxHeight) // limit height to maxHeight
      };

      await elementOrPage.screenshot({ 
        path: screenshotPath,
        clip: paddedBox 
      });
    } else {
      throw new Error('Invalid argument, expected puppeteer.Page or puppeteer.ElementHandle');
    }

    return screenshotPath;
  } catch (error) {
    console.error(`Failed to capture screenshot. ${error}`);
  }
};