# Google Search Console Crawler

This script is a Node.js application that uses Puppeteer to automate browsing the Google Search Console (GSC) and collects data from various sections into a Markdown file. It also takes screenshots of the pages it visits.

## Prerequisites

- Node.js (v16.0.0 or later)
- Google Chrome (or Chromium)

## Installation

1. Clone the repository:

    ```
    git clone https://github.com/<your_username>/gsc-crawler.git
    ```

2. Navigate into the cloned repository:

    ```
    cd gsc-crawler
    ```

3. Install dependencies:

    ```
    npm install
    ```

## Usage

You need to specify the site URL you want to crawl as a command-line argument using `-s` or `--siteUrl`. For example:

    ```
    node index.js -s https://example.com/
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

The script creates a new Markdown file in the `markdown` directory with data from the crawled sections for the specified site. The name of the Markdown file is the cleaned site URL (e.g., `example_com.md`).

Additionally, the script takes screenshots of the pages it visits and saves them in the `screenshots` directory.


