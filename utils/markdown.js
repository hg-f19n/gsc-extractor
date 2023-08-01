const fs = require("fs");
const path = require("path");

module.exports.createNewMarkdownFile = async (cleanSiteUrl) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const markdownFilePath = path.join(__dirname, '../markdown', `${cleanSiteUrl}_${timestamp}.md`);

  const frontMatter = 
  
`---
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
    const markdownSlide = 
    
`
<!-- _class: default -->

# ${headline}

![w:auto h:auto](${relativeScreenshotPath})
[${pageUrl}](${pageUrl})

---

`;

    fs.appendFileSync(markdownFilePath, markdownSlide); // append the markdown slide to the file
  } catch (error) {
    console.error(`Failed to generate markdown slide. ${error}`);
  }
};


module.exports.generateMarkdownSlideWithTwoImages = async (headline, subheadline1, subheadline2, screenshotPath1, screenshotPath2, pageUrl1, pageUrl2, markdownFilePath) => {
  try {
    const markdownDir = path.resolve(__dirname, '../markdown');
    const relativeScreenshotPath1 = path.relative(markdownDir, screenshotPath1);
    const relativeScreenshotPath2 = path.relative(markdownDir, screenshotPath2);
    
    const markdownSlide = 
    
`
<!-- _class: split -->

# ${headline}

<div style="display: flex; justify-content: space-between;">
    <div style="width: 47%;">
      <h2>${subheadline1}</h2>
      <img src="${relativeScreenshotPath1}"/>
      <a href="${pageUrl1}">${pageUrl1}</a>
    </div>
    <div style="width: 47%;">
      <h2>${subheadline2}</h2>
      <img src="${relativeScreenshotPath2}"/>
      <a href="${pageUrl2}">${pageUrl2}</a>
    </div>
</div>

---

`;

    fs.appendFileSync(markdownFilePath, markdownSlide); // append the markdown slide to the file
  } catch (error) {
    console.error(`Failed to generate markdown slide. ${error}`);
  }
};