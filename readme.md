# Google Search Console Reporter

This script is a Node.js application that uses Puppeteer to automate browsing the Google Search Console (GSC) and collects data from various sections into a Markdown file. It also takes screenshots of the pages it visits.

## Prerequisites

- Node.js (v16.0.0 or later)
- Google Chrome (or Chromium)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/hg-f19n/gsc-reporter.git
   ```

2. Navigate into the cloned repository:

   ```
   cd gsc-reporter
   ```

3. Install dependencies:

   ```
   npm install
   ```


## Usage

You need to specify the site URL you want to crawl as a command-line argument using `-s` or `--siteUrl`. Optionally, you can specify a brand name using `-b` or `--brandName`. If you don't specify a brand, it gets extracted out of the siteUrl For example:

   ```
   node index.js -s https://example.com/ -b "Example Brand"
   ```



### Initial Google Account Login

For the first time you run the script, you need to manually log in to your Google Account. This is because the script uses cookies to authenticate with Google, and you need to provide these cookies on the first run.

The script will open a browser window where you can log in. After logging in, the script will save the cookies into a `cookies.json` file, and these will be used for automatic login in future runs.

## Sections Crawled

The script crawls the following sections from the Google Search Console:

- News
- Discover
- Crawl Stats
- Performance
- Indexing
- Experience
- Enhancements
- Shopping
- Security Actions
- Links

## Output

The results of each test are saved in the Markdown format. These Markdown files are then automatically converted to HTML and PDF for easy sharing and reporting.

### Directory Structure for Outputs:

- **Markdown Outputs**: These are saved in the `./markdown` directory.
- **HTML and PDF Outputs**: After the Markdown results are generated, they're converted into HTML and PDF formats and saved in the `./results` directory.

### Conversion:

The conversion of Markdown files to HTML and PDF formats is powered by Marp CLI. Our tool employs the `convertMarkdown` utility, which can be found in `./utils/conversion`, to leverage Marp's capabilities and transform Markdown documents seamlessly.

### Manual Conversion

To manually convert a specific Markdown file to HTML and PDF, use the `--convert` or `-c` option followed by either "latest" (to convert the most recently modified .md file) or the path to a specific Markdown file:


Convert the latest Markdown file:

```bash
node index.js -c latest
```

Convert a specific Markdown file:

```bash
node index.js -c path/to/your_markdown_file.md
```

Replace <path_to_your_markdown_file> with the appropriate path.
