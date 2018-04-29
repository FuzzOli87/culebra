import request from 'request-promise-native';
import crawlHTML from './lib/crawlHTML';

/**
  Start the crawling process with culebra
  @private
*/
export default async function culebra(urlToCrawl) {
  const resultTracker = [];
  const visitedLinks = [];

  // We are going to manage state within this module for simplicity
  async function requestAndCrawl(url) {
    if (visitedLinks.includes(url)) {
      return;
    }

    const page = await request(url);

    visitedLinks.push(url);
    const crawlResult = crawlHTML(page, url);

    const { internalLinks } = crawlResult;

    // This sets off an async recursive loop to crawl any internal links only
    await Promise.all(internalLinks.map(link => requestAndCrawl(link)));

    resultTracker.push(Object.assign({ pageCrawled: url }, crawlResult));
  }

  // Kick off the process
  await requestAndCrawl(urlToCrawl);

  return resultTracker;
}
