const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const readline = require('readline');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { sleep } = require('./utils/wait');
const markdown = require('./utils/markdown');
const { saveCookies, loadCookies } = require('./utils/cookies');
const { convertMarkdown } = require('./utils/conversion');

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

const directories = ['screenshots', 'markdown', 'results'];

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
      demandOption: false,
    })
    .option('b', {
      alias: 'brandName',
      describe: 'Brand name',
      type: 'string',
      demandOption: false,
    })
    .option('c', {
      alias: 'convert',
      describe: 'Provide "latest" to convert the most recent Markdown file or provide the path to a specific Markdown file',
      type: 'string',
      demandOption: false,
    })
    .argv;

  if (!argv.s && !argv.c) {
    console.error('Either a site URL (-s) or the conversion flag (-c) must be provided.');
    process.exit(1);
  }

  if (argv.s && argv.c) {
    console.error('You can either provide a site URL (-s) for scraping or use the conversion flag (-c) for conversion, but not both.');
    process.exit(1);
  }


  // If conversion flag is set, handle it
  if (argv.c) {
    let mdFilePath;

    if (argv.c.toLowerCase() === 'latest') {
      const markdownFiles = fs.readdirSync(path.join(__dirname, 'markdown')).filter(file => file.endsWith('.md'));
      const latestFile = markdownFiles.sort((a, b) => fs.statSync(path.join(__dirname, 'markdown', b)).mtime.getTime() - fs.statSync(path.join(__dirname, 'markdown', a)).mtime.getTime())[0];

      if (!latestFile) {
        console.error('No markdown files found.');
        process.exit(1);
      }

      mdFilePath = path.join(__dirname, 'markdown', latestFile);
    } else {
      mdFilePath = argv.c;
    }

    if (fs.existsSync(mdFilePath)) {
      try {
        const outputPaths = convertMarkdown(mdFilePath);
        console.log('Conversion completed. Files saved at:', outputPaths);
      } catch (error) {
        console.error('Error during manual conversion:', error);
      }
    } else {
      console.error(`File ${mdFilePath} does not exist.`);
    }

    process.exit();
  }

  const siteUrl = ensureTrailingSlash(argv.s);
  const brandName = argv.b || "";

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

  const markdownFilePath = await markdown.createNewMarkdownFile(siteUrl);

  await performance.run(page, siteUrl, markdownFilePath, brandName);
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

  try {
    const outputPaths = await convertMarkdown(markdownFilePath);
    console.log('Conversion completed. Files saved at:', outputPaths);
  } catch (error) {
    console.error('Error during conversion:', error);
  }

})();