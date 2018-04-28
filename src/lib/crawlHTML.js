import cheerio from 'cheerio';
import { resolve } from 'url';

export default function crawlHTML(htmlToCrawl, resolveToUrl) {
  const $ = cheerio.load(htmlToCrawl);

  const internalLinks = [];
  const externalLinks = [];
  const staticContentLinks = [];

  // Get relative links(those that don't start with http or https)
  $("a:not([href^='http'])").each(function findRelativeLinks() {
    const href = $(this).attr('href');
    // Resolve to full address using the sub-url
    const fullLink = resolve(resolveToUrl, href);

    const extensionBegins = href.lastIndexOf('.');
    const hasExtension = extensionBegins >= 0;

    // If this url has an extension
    if (hasExtension) {
      const extension = href.substr(extensionBegins).toLowerCase();

      // If it is of HTML(could be a link to a JPEG or something), add it to internal links
      if (extension === '.html') {
        internalLinks.push(fullLink);

        return;
      }

      // Otherwise, assume that its something static
      staticContentLinks.push(fullLink);

      return;
    }

    /*
     * If it has no extension, might be some page configured to be fetched by some path rewrite,
     * lets try it.
     */
    internalLinks.push(fullLink);
  });

  // Get links that start with http/https, these are external
  $("a[href^='http']").each(function findExternalLinks() {
    const href = resolve(resolveToUrl, $(this).attr('href'));
    externalLinks.push(href);
  });

  // Get static content which we define as javascript files and image files
  $("img, script[type='text/javascript']").each(function findImagesOrJavascripts() {
    const src = resolve(resolveToUrl, $(this).attr('src'));
    staticContentLinks.push(src);
  });

  // Get static content that are stylesheet links
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
