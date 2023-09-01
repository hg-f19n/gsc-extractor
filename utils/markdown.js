const fs = require("fs");
const path = require("path");
const { domainNameFromUrl, getCurrentTimestampFormatted } = require('../utils/sanitizers');

module.exports.createNewMarkdownFile = async (siteUrl) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const creationDate = getCurrentTimestampFormatted();
  const siteUrlDomainOnly = domainNameFromUrl(siteUrl);
  const markdownFilePath = path.join(process.cwd(), '_gsc-reporter-output', 'markdown', `${siteUrlDomainOnly}_${timestamp}.md`);


  //const markdownDir = path.resolve(__dirname, '../markdown');
  const markdownDir = path.resolve(process.cwd(), '_gsc-reporter-output', 'markdown');

  //const logoPath = path.join(__dirname, '../assets', 'logo.svg');
  //const relativelogoPath = path.relative(markdownDir, logoPath);

  const frontMatter = 
`---
theme: f19n-theme
paginate: true
footer: 'Google Search Console Report for ${siteUrl} - Generated: ${creationDate} - Powered by [https://www.fullstackoptimization.com/](https://www.fullstackoptimization.com/)'
_class: title
---

# Google Search Console Report
## ${siteUrl}
### Generated: ${creationDate}

---

`;

  fs.writeFileSync(markdownFilePath, frontMatter); // Create a file with front matter
  return markdownFilePath;
};

module.exports.generateMarkdownSlide = async (headline, screenshotPath, pageUrl, markdownFilePath) => {
  try {
    const markdownDir = path.resolve(process.cwd(), '_gsc-reporter-output', 'markdown');
    const relativeScreenshotPath = path.relative(markdownDir, screenshotPath);
    const markdownSlide = 
    
`
<!-- _class: default -->

# ${headline}

:::: slideInner

:::col
![screenshot](${relativeScreenshotPath})
:::

:::col
:::

::::

[Link to Google Search Console](${pageUrl})

---

`;

    fs.appendFileSync(markdownFilePath, markdownSlide); // append the markdown slide to the file
  } catch (error) {
    console.error(`Failed to generate markdown slide. ${error}`);
  }
};


module.exports.generateMarkdownSlideWithTwoImages = async (headline, subheadline1, subheadline2, screenshotPath1, screenshotPath2, pageUrl1, pageUrl2, markdownFilePath) => {
  try {
    const markdownDir = path.resolve(process.cwd(), '_gsc-reporter-output', 'markdown');
    const relativeScreenshotPath1 = path.relative(markdownDir, screenshotPath1);
    const relativeScreenshotPath2 = path.relative(markdownDir, screenshotPath2);
    
    const markdownSlide = 
    
`
<!-- _class: split -->

# ${headline}

:::: slideInner

:::col
## ${subheadline1}
![screenshot](${relativeScreenshotPath1})
[Link to Google Search Console](${pageUrl1})
:::

:::col
## ${subheadline2}
![screenshot](${relativeScreenshotPath2})
[Link to Google Search Console](${pageUrl2})
:::

::::

---

`;

    fs.appendFileSync(markdownFilePath, markdownSlide); // append the markdown slide to the file
  } catch (error) {
    console.error(`Failed to generate markdown slide. ${error}`);
  }
};