import path from 'path';
import fs from 'fs';
import crawl from './crawlHTML';

const fullTestFile = fs.readFileSync(path.resolve(__dirname, '../../__fixtures__/crawl-html/full.html'));
const internalNoExtFile = fs.readFileSync(path.resolve(__dirname, '../../__fixtures__/crawl-html/internal-no-extension.html'));
const nothingFile = fs.readFileSync(path.resolve(__dirname, '../../__fixtures__/crawl-html/nothing.html'));
const noPropFile = fs.readFileSync(path.resolve(__dirname, '../../__fixtures__/crawl-html/no-props.html'));
const urlToResolveLinksTo = 'http://www.crawlhtmltest.com';

describe('crawlHTML', () => {
  it('should crawl and extract URLs to pages in same domain, external URLs and static content', () => {
    const crawlResult = crawl(fullTestFile, urlToResolveLinksTo);
    const expectedResult = {
      internalLinks: [
        'http://www.crawlhtmltest.com/dogs/dogs.html',
        'http://www.crawlhtmltest.com/cats/cats.html',
        'http://www.crawlhtmltest.com/values.html'
      ],
      externalLinks: ['http://www.github.com/', 'https://www.google.com/'],
      staticContentLinks: [
        'http://www.crawlhtmltest.com/static/images/cat.jpg',
        'http://www.crawlhtmltest.com/spider.jpg',
        'http://www.crawlhtmltest.com/static/js/nothing-illegal.js',
        'http://www.crawlhtmltest.com/static/styles.css'
      ]
    };

    expect(crawlResult).toEqual(expectedResult);
  });

  it('should return a bunch of empty arrays when there are no internal, external or static content links', () => {
    const crawlResult = crawl(nothingFile, urlToResolveLinksTo);
    const expectedResult = {
      internalLinks: [],
      externalLinks: [],
      staticContentLinks: []
    };

    expect(crawlResult).toEqual(expectedResult);
  });

  it('should returl a non-extensioned internal link so the request can be made as is', () => {
    const crawlResult = crawl(internalNoExtFile, urlToResolveLinksTo);
    const expectedResult = {
      internalLinks: ['http://www.crawlhtmltest.com/noextension'],
      externalLinks: [],
      staticContentLinks: []
    };

    expect(crawlResult).toEqual(expectedResult);
  });

  it('should ignore any link that does not have the necessary html property(src,href)', () => {
    const crawlResult = crawl(noPropFile, urlToResolveLinksTo);
    const expectedResult = {
      internalLinks: ['http://www.crawlhtmltest.com/cats/cats.html'],
      externalLinks: [],
      staticContentLinks: ['http://www.crawlhtmltest.com/spider.jpg']
    };

    expect(crawlResult).toEqual(expectedResult);
  });
});
