const path = require("path");

module.exports.screenshot = async (page, name) => {
  try {
    const screenshotPath = path.resolve(
      __dirname,
      "../screenshots",
      `${name}.png`
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  } catch (error) {
    console.error(error);
  }
};
