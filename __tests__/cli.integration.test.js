import path from 'path';
import stripIndent from 'strip-indent';
import getStream from 'get-stream';
import { spawn } from 'child_process';
import createMockServer from './__helpers__/createMockServer';

const babelBinPath = require.resolve('babel-cli/bin/babel-node');

const cliPath = path.join(__dirname, '../src/index');

const mockServer = createMockServer();
beforeAll(() => mockServer.startServer(3000));
afterAll(() => mockServer.stopServer());

function execCli(cliArgs = []) {
  const child = spawn(`${babelBinPath}`, [cliPath].concat(cliArgs), {
    stdio: [null, 'pipe', 'pipe']
  });

  const stdout = getStream(child.stdout);
  const stderr = getStream(child.stderr);

  return Promise.all([stdout, stderr]);
}

describe('executing culebra', () => {
  it('should display help when no arguments are passed', async () => {
    const [stdout, stderr] = await execCli();

    expect(stderr).toBeFalsy();
    expect(stripIndent(stdout).trim()).toContain(stripIndent(`
      A command-line web crawler that outputs a nice JSON output of the site map

      Displays an array of JSON objects with the following properties:
      {
        pageCrawled: The full URL of the page crawled
        internalLinks: Array of links to internal sites(if any)
        externalLinks: Array of links to external sites(if any)
        staticContentLinks: Array of static content links(if any)
      }

      Caveats
        - It only crawls the main domain's pages. It will not crawl links to external sites.
        - The resulting links are flat, you can see parent child relationships by reading the full link. 
          This was to avoid a deeply nested JSON structure.

      Usage
        $ culebra <URL>

      Examples
        $ culebra www.test.com

        Will output:
        [
          {
            "pageCrawled": "http://www.test.com/cats/cats.html",
            "internalLinks": [],
            "externalLinks": [],
            "staticContentLinks": [
              "http://www.test.com/cats/static/images/cat.jpg",
              "http://www.test.com/cats/static/images/nice-cat.jpg",
              "http://www.test.com/cats/static/js/meow.js",
              "http://www.test.com/cats/static/styles.css"
            ]
          },
          {
            "pageCrawled": "http://www.test.com/values.html",
            "internalLinks": [],
            "externalLinks": [
              "https://www.values.com/"
            ],
            "staticContentLinks": []
          },
          {
            "pageCrawled": "http://www.test.com/dogs/small.html",
            "internalLinks": [],
            "externalLinks": [
              "http://www.google.com/"
            ],
            "staticContentLinks": [
              "http://www.test.com/dogs/static/images/tiny-dog.png"
            ]
          },
          {
            "pageCrawled": "http://www.test.com/dogs/dogs.html",
            "internalLinks": [
              "http://www.test.com/dogs/small.html"
            ],
            "externalLinks": [],
            "staticContentLinks": []
          },
          {
            "pageCrawled": "http://www.test.com",
            "internalLinks": [
              "http://www.test.com/dogs/dogs.html",
              "http://www.test.com/cats/cats.html",
              "http://www.test.com/values.html"
            ],
            "externalLinks": [
              "http://www.github.com/",
              "https://www.google.com/"
            ],
            "staticContentLinks": [
              "http://www.test.com/spider.jpg",
              "http://www.test.com/static/js/nothing-illegal.js",
              "http://www.test.com/static/styles.css"
            ]
          }
        ]
    `).trim());
  });

  it('should return JSON result of site crawl', async () => {
    const testURL = 'http://localhost:3000';
    const [stdout, stderr] = await execCli([testURL]);

    expect(stderr).toBeFalsy();

    expect(stripIndent(stdout).trim()).toContain(stripIndent(JSON.stringify(
      [
        {
          pageCrawled: 'http://localhost:3000/cats/cats.html',
          internalLinks: [],
          externalLinks: [],
          staticContentLinks: [
            'http://localhost:3000/cats/static/images/cat.jpg',
            'http://localhost:3000/cats/static/images/nice-cat.jpg',
            'http://localhost:3000/cats/static/js/meow.js',
            'http://localhost:3000/cats/static/styles.css'
          ]
        },
        {
          pageCrawled: 'http://localhost:3000/values.html',
          internalLinks: [],
          externalLinks: ['https://www.values.com/'],
          staticContentLinks: []
        },
        {
          pageCrawled: 'http://localhost:3000/noextension',
          internalLinks: [],
          externalLinks: [],
          staticContentLinks: []
        },
        {
          pageCrawled: 'http://localhost:3000/dogs/small.html',
          internalLinks: [],
          externalLinks: ['http://www.google.com/'],
          staticContentLinks: ['http://localhost:3000/dogs/static/images/tiny-dog.png']
        },
        {
          pageCrawled: 'http://localhost:3000/dogs/dogs.html',
          internalLinks: ['http://localhost:3000/dogs/small.html'],
          externalLinks: [],
          staticContentLinks: []
        },
        {
          pageCrawled: 'http://localhost:3000',
          internalLinks: [
            'http://localhost:3000/dogs/dogs.html',
            'http://localhost:3000/cats/cats.html',
            'http://localhost:3000/values.html',
            'http://localhost:3000/noextension'
          ],
          externalLinks: ['http://www.github.com/', 'https://www.google.com/'],
          staticContentLinks: [
            'http://localhost:3000/spider.jpg',
            'http://localhost:3000/static/js/nothing-illegal.js',
            'http://localhost:3000/static/styles.css'
          ]
        }
      ],
      null,
      4
    )).trim());
  });
});
