const fs = require('fs').promises;
const path = require('path');

const cookiesPath = path.join(__dirname, '..', 'cookies.json');
//const cookiesPath = path.join(process.cwd(), '_gsc-reporter-output', 'cookies.json');

async function saveCookies(page, path = cookiesPath) {
  console.log('Saving cookies to:', path);
  const cookies = await page.cookies();
  await fs.writeFile(path, JSON.stringify(cookies, null, 2));
  console.log('Saved cookies.');
}

async function loadCookies(page, path = cookiesPath) {
  console.log('Loading cookies from:', path);
  try {
    const cookiesString = await fs.readFile(path);
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    console.log('Loaded cookies.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No cookies file found.');
      throw new Error('No cookies file found.');
    } else {
      throw error;
    }
  }
}

module.exports = { saveCookies, loadCookies };
