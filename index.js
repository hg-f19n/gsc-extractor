const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const readline = require('readline');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { sleep } = require('./utils/wait');
const { cleanUrl } = require('./utils/urls');
const markdown = require('./utils/markdown');
const { saveCookies, loadCookies } = require('./utils/cookies');
const cookiesPath = path.join(__dirname, '..', 'cookies.json');

const crawlStats = require('./sections/crawl-stats');
const links = require('./sections/links');
const securityActions = require('./sections/security-actions');
const enhancements = require('./sections/enhancements');
const shopping = require('./sections/shopping');
const experience = require('./sections/experience');
const indexing = require('./sections/indexing');
const performance = require('./sections/performance');
const discover = require('./sections/discover');
const news = require('./sections/news');

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

const directories = ['screenshots', 'markdown'];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
});

(async () => {
  const argv = yargs(hideBin(process.argv))
    .option('s', {
      alias: 'siteUrl',
      describe: 'Site URL for Google Search Console',
      type: 'string',
      demandOption: true,
    })
    .argv;

  const siteUrl = ensureTrailingSlash(argv.s);

  const cleanSiteUrl = cleanUrl(siteUrl);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1400, height: 900 },
  });

  const page = await browser.newPage();

  await page.goto('https://accounts.google.com');

  try {
    await loadCookies(page);
  } catch (error) {
    if (error.message === 'No cookies file found.') {
      console.log('Navigating to Google sign in page.');
      await page.goto('https://accounts.google.com/signin');
  
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
  
      await new Promise((resolve, reject) => {
        rl.question("Please login to your Google account in the browser then press Enter to continue...", function (answer) {
          resolve();
        });
      });
  
      rl.close();
  
      await saveCookies(page);
  
      await sleep(2000);
    } else {
      console.error(`Error loading cookies: ${error}`);
      process.exit(1); // or whatever your error handling strategy is
    }
  }

  const markdownFilePath = await markdown.createNewMarkdownFile(cleanSiteUrl);

  await performance.run(page, siteUrl, markdownFilePath);
  await news.run(page, siteUrl, markdownFilePath);
  await discover.run(page, siteUrl, markdownFilePath);
  await crawlStats.run(page, siteUrl, markdownFilePath);
  await indexing.run(page, siteUrl, markdownFilePath);
  await experience.run(page, siteUrl, markdownFilePath);
  await enhancements.run(page, siteUrl, markdownFilePath);
  await shopping.run(page, siteUrl, markdownFilePath);
  await securityActions.run(page, siteUrl, markdownFilePath);
  await links.run(page, siteUrl, markdownFilePath);

  await browser.close();

})();