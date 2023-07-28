module.exports.cleanUrl = (url) => {
    return url.replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,'');
};