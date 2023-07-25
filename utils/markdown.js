const fs = require("fs");
const path = require("path");

module.exports.writeMarkdown = (name, url) => {
  const mdContent = `![Screenshot](../screenshots/${name}.png)\n\nURL: ${url}\n\n`;
  fs.appendFileSync(
    path.resolve(__dirname, "../markdown", `${name}.md`),
    mdContent
  );
};
