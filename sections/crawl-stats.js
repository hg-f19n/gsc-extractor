const screenshot = require("../utils/screenshot");
const markdown = require("../utils/markdown");

module.exports.run = async (page) => {
  try {
    await page.goto("https://search.google.com/search-console/crawl-stats");

    const url = page.url();
    await screenshot.screenshot(page, "crawl-stats");

    markdown.writeMarkdown("crawl-stats", url);
  } catch (error) {
    console.error(error);
  }
};
