import request from 'request-promise-native';
import cheerio from 'cheerio';
import { resolve } from 'url';

function crawlHTML(htmlToCrawl, resolveToUrl) {
  const $ = cheerio.load(htmlToCrawl);

  const internalLinks = [];
  const externalLinks = [];
  const staticContentLinks = [];

  $("a:not([href^='http'])").each(function findRelativeLinks() {
    const href = resolve(resolveToUrl, $(this).attr('href'));

    const extensionBegins = href.lastIndexOf('.');
    const hasExtension = extensionBegins >= 0;

    if (hasExtension) {
      const extension = href.substr(extensionBegins).toLowerCase();

      if (extension === '.html') {
        internalLinks.push(href);

        return;
      }

      staticContentLinks.push(href);

      return;
    }

    internalLinks.push(href);
  });

  $("a[href^='http']").each(function findExternalLinks() {
    const href = resolve(resolveToUrl, $(this).attr('href'));
    externalLinks.push(href);
  });

  $("img, script[type='text/javascript']").each(function findImagesOrJavascripts() {
    const src = resolve(resolveToUrl, $(this).attr('src'));
    staticContentLinks.push(src);
  });

  $("link[rel='stylesheet']").each(function findStyleSheets() {
    const href = resolve(resolveToUrl, $(this).attr('href'));
    staticContentLinks.push(href);
  });

  return {
    internalLinks,
    externalLinks,
    staticContentLinks
  };
}

export default async function culebra(urlToCrawl) {
  const resultTracker = [];

  async function requestAndCrawl(url) {
    const page = await request(url);

    const crawlResult = crawlHTML(page, url);

    const { internalLinks } = crawlResult;

    await Promise.all(internalLinks.map(link => requestAndCrawl(link)));

    resultTracker.push(Object.assign({ pageCrawled: url }, crawlResult));
  }

  await requestAndCrawl(urlToCrawl);

  return resultTracker;
}
