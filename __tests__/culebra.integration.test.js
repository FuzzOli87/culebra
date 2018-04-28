import createMockServer from './__helpers__/createMockServer';
import culebra from '../src/culebra';

const mockServer = createMockServer();
beforeAll(() => mockServer.startServer(3001));
afterAll(() => mockServer.stopServer());

describe('culebra', () => {
  const testURL = 'http://localhost:3001';

  it('should generate sitemap from the HTML returned from http GET request to URL', async () => {
    const siteMap = await culebra(testURL);
    const expectedResult = [
      {
        pageCrawled: 'http://localhost:3001/cats/cats.html',
        internalLinks: [],
        externalLinks: [],
        staticContentLinks: [
          'http://localhost:3001/cats/static/images/cat.jpg',
          'http://localhost:3001/cats/static/images/nice-cat.jpg',
          'http://localhost:3001/cats/static/js/meow.js',
          'http://localhost:3001/cats/static/styles.css'
        ]
      },
      {
        pageCrawled: 'http://localhost:3001/values.html',
        internalLinks: [],
        externalLinks: ['https://www.values.com/'],
        staticContentLinks: []
      },
      {
        pageCrawled: 'http://localhost:3001/noextension',
        internalLinks: [],
        externalLinks: [],
        staticContentLinks: []
      },
      {
        pageCrawled: 'http://localhost:3001/dogs/small.html',
        internalLinks: [],
        externalLinks: ['http://www.google.com/'],
        staticContentLinks: ['http://localhost:3001/dogs/static/images/tiny-dog.png']
      },
      {
        pageCrawled: 'http://localhost:3001/dogs/dogs.html',
        internalLinks: ['http://localhost:3001/dogs/small.html'],
        externalLinks: [],
        staticContentLinks: []
      },
      {
        pageCrawled: 'http://localhost:3001',
        internalLinks: [
          'http://localhost:3001/dogs/dogs.html',
          'http://localhost:3001/cats/cats.html',
          'http://localhost:3001/values.html',
          'http://localhost:3001/noextension'
        ],
        externalLinks: ['http://www.github.com/', 'https://www.google.com/'],
        staticContentLinks: [
          'http://localhost:3001/spider.jpg',
          'http://localhost:3001/static/js/nothing-illegal.js',
          'http://localhost:3001/static/styles.css'
        ]
      }
    ];

    expect(siteMap).toEqual(expectedResult);
  });
});
