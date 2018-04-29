#!/usr/bin/env node

import meow from 'meow';
import culebra from './culebra';

const cli = meow(`
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
`);

const urlToCrawl = cli.input[0];

(async function startCrawl() {
  if (!urlToCrawl) {
    return cli.showHelp();
  }

  console.log(urlToCrawl);
  const resultOfCrawl = await culebra(urlToCrawl);

  return console.log(JSON.stringify(resultOfCrawl, null, 4));
}());
