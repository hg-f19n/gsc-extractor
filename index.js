const puppeteer = require('puppeteer');
const readline = require('readline');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const crawlStats = require('./sections/crawl-stats');
//const indexing = require('./sections/indexing');
const { sleep } = require('./utils/wait');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

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
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1400, height: 1000 },
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

  await crawlStats.run(page, siteUrl);
  //await indexing.run(page, siteUrl);

  await browser.close();
})();