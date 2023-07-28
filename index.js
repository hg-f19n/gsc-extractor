const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const readline = require('readline');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { sleep } = require('./utils/wait');
const { cleanUrl } = require('./utils/urls');
const markdown = require('./utils/markdown');


const crawlStats = require('./sections/crawl-stats');
//const indexing = require('./sections/indexing');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

  // navigate to Google's login page for manual login
  await page.goto('https://accounts.google.com/signin');

  await new Promise((resolve, reject) => {
    rl.question("Please login to your Google account in the browser then press Enter to continue...", function(answer){
      resolve();
    });
  });

  rl.close();

  await sleep(2000);

  const markdownFilePath = await markdown.createNewMarkdownFile(cleanSiteUrl);

  await crawlStats.run(page, siteUrl, markdownFilePath);
  //await indexing.run(page, siteUrl);

  await browser.close();
})();