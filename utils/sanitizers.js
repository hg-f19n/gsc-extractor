/**
 * Returns the current timestamp in the format "dd.mm.yyyy hh:mm".
 * 
 * @returns {string} The formatted timestamp.
 */
function getCurrentTimestampFormatted() {
  const now = new Date();

  return `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/**
 * Removes the protocol (http/https) and optional 'www.' prefix from a given URL.
 * It also strips the trailing slash if present.
 *
 * @param {string} url - The URL to process.
 * @returns {string} The sanitized domain name from the provided URL.
 */
const domainNameFromUrl = (url) => {
  return url.replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,'');
};

/**
 * Retrieves the base URL of the first page in the 'pages' object. 
 * The returned object contains both the full and sanitized versions of the URL.
 * 
 * @returns {Object} An object containing:
 *   - full {string}: The full base URL with a trailing slash, if needed.
 *   - domain {string}: The sanitized version of the URL, with protocol and www. removed, if present.
 */
const getSiteUrl = (siteUrl) => {
  siteUrlBase = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
  const siteUrlDomainOnly = domainNameFromUrl(siteUrlBase);

  return {
    full: siteUrlBase,
    domain: siteUrlDomainOnly
  };
};

/**
 * Removes spaces from a string and converts it to lowercase.
 *
 * @param {string} str - The string to sanitize.
 * @returns {string} The sanitized string.
 */
function sanitizeString(str) {
  return str.replace(/\s+/g, '').toLowerCase();
}

module.exports = {
  domainNameFromUrl,
  getSiteUrl,
  sanitizeString,
  getCurrentTimestampFormatted,
};


