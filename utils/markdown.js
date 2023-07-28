const fs = require("fs");
const path = require("path");

module.exports.createNewMarkdownFile = async (cleanSiteUrl) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const markdownFilePath = path.join(__dirname, '../markdown', `${cleanSiteUrl}_${timestamp}.md`);

  const frontMatter = `---
theme: custom-theme
paginate: true
---

`;

  fs.writeFileSync(markdownFilePath, frontMatter); // Create a file with front matter
  return markdownFilePath;
};

module.exports.generateMarkdownSlide = async (headline, screenshotPath, pageUrl, markdownFilePath) => {
  try {
    const markdownDir = path.resolve(__dirname, '../markdown');
    const relativeScreenshotPath = path.relative(markdownDir, screenshotPath);
    const markdownSlide = `# ${headline}

![w:auto h:780](${relativeScreenshotPath})
[View Page](${pageUrl})

---`;

    fs.appendFileSync(markdownFilePath, markdownSlide); // append the markdown slide to the file
  } catch (error) {
    console.error(`Failed to generate markdown slide. ${error}`);
  }
};