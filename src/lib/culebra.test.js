import path from 'path';
import nock from 'nock';
import culebra from './culebra';

describe('culebra', () => {
  describe('no static content, no external sites on any page', () => {
    const testURL = 'http://www.test.com';

    nock(testURL)
      .get('/')
      .replyWithFile(200, path.resolve(__dirname, '../../__tests__/__fixtures__/web/index.html'))
      .get('/values.html')
      .replyWithFile(200, path.resolve(__dirname, '../../__tests__/__fixtures__/web/values.html'))
      .get('/dogs/dogs.html')
      .replyWithFile(
        200,
        path.resolve(__dirname, '../../__tests__/__fixtures__/web/dogs/dogs.html')
      )
      .get('/dogs/small.html')
      .replyWithFile(
        200,
        path.resolve(__dirname, '../../__tests__/__fixtures__/web/dogs/small.html')
      )
      .get('/cats/cats.html')
      .replyWithFile(
        200,
        path.resolve(__dirname, '../../__tests__/__fixtures__/web/cats/cats.html')
      );

    it('should generate sitemap from the HTML returned from http GET request to URL', async () => {
      const siteMap = await culebra(testURL);
      const expectedResult = [
        {
          pageCrawled: 'http://www.test.com/cats/cats.html',
          internalLinks: [],
          externalLinks: [],
          staticContentLinks: [
            'http://www.test.com/cats/static/images/cat.jpg',
            'http://www.test.com/cats/static/images/nice-cat.jpg',
            'http://www.test.com/cats/static/js/meow.js',
            'http://www.test.com/cats/static/styles.css'
          ]
        },
        {
          pageCrawled: 'http://www.test.com/values.html',
          internalLinks: [],
          externalLinks: ['https://www.values.com/'],
          staticContentLinks: []
        },
        {
          pageCrawled: 'http://www.test.com/dogs/small.html',
          internalLinks: [],
          externalLinks: ['http://www.google.com/'],
          staticContentLinks: ['http://www.test.com/dogs/static/images/tiny-dog.png']
        },
        {
          pageCrawled: 'http://www.test.com/dogs/dogs.html',
          internalLinks: ['http://www.test.com/dogs/small.html'],
          externalLinks: [],
          staticContentLinks: []
        },
        {
          pageCrawled: 'http://www.test.com',
          internalLinks: [
            'http://www.test.com/dogs/dogs.html',
            'http://www.test.com/cats/cats.html',
            'http://www.test.com/values.html'
          ],
          externalLinks: ['http://www.github.com/', 'https://www.google.com/'],
          staticContentLinks: [
            'http://www.test.com/spider.jpg',
            'http://www.test.com/static/js/nothing-illegal.js',
            'http://www.test.com/static/styles.css'
          ]
        }
      ];

      expect(siteMap).toEqual(expectedResult);
    });
  });
});
