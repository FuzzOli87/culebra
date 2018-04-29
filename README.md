# culebra

A simple web crawler that only looks at it's own domain and outputs a JSON structure showing you the results!

### Prerequisites

Make sure you have LTS release node.js installed.

#### OSX

These steps will also install NPM, Node's package manager.

1.  You can download the installer from: https://nodejs.org/en/
2.  You can use homebrew and run: `brew install node`

#### Linux

Use the package manager for your distro:

##### Archlinux

1.  Run the following command: `pacman -S nodejs-lts-carbon`

## CONTRIBUTING

These are the steps to follow if you would like to make a contribution or just want to play around with this code locally.

1.  Clone this repo
2.  In the repos directory, run `npm install` to install all dependencies

### Running tests

This will run unit tests and show coverage:

1.  To run unit tests, run `npm start test`
2.  To run unit tests and watch for changes(for development), run `npm start test.watch`

This will run integration tests and show coverage:

1.  To run integration tests, run `npm start test.integration`
2.  To run integration tests and watch for changes(for development), run `npm start test.integrationWatch`(You might have to hit `a` to run all tests due to the servers that sometimes boot up before jest executes)

### To lint code

This will lint the Javascript code, executed before all commits:

1.  Run `npm start lint`

### To build

This will transpile any Javascript to the Node version dictated by the environment.

1.  Run `npm start build`

### To execute

After you have built the application you can use it by running:

1.  ./dist/index.js urlToCrawl

If you don't want to build it, you can use babel-node to execute the untranspiled code by running:
`node_modules/.bin/babel-node src/index.js`

### INSTALLING

This module was published as a CLI app, to install it, simply run
`npm install culebra -g`

And culebra should now be available to use by doing:
`culebra urlToCrawl`

### Trade-Offs

The trade-offs made were mostly related to length of time available to work on this. Some assumptions were:

1.  Static content is defined as javascript files, image files and stylesheets.
2.  Websites crawled are PERFECT with no dead links.
3.  Websites crawled serve HTML and can be obtained through GET requests. Applications build with React.js for example might not serve the full HTML.
4.  The feature set is SIMPLE. Just a URL to crawl.

These trade-offs were made to keep the scope of the task within reach but still deliver the core functionality.

### TESTING PHILOSOPHY

I started with TDD/BDD Unit Tests using the Jest library and built up from the core crawling and fetching of pages logic. After it ran, I then chunked up some of the logic into their own modules and added unit tests.

My philosophy is stick with TDD/BDD to ensure that the API meets the necessary requirements. This limits scope creep and keeps the API clean. Using BDD keeps the mind on the API of the application and not the implementation of the code which leads to brittle tests.

Integration tests were done in a similar fashion, but the tricky part was the CLI tool testing. I had to build a processor for it. Otherwise, its TDD all the way with jest.

Unit tests and integration tests are a must for any library that will be consumed by others. e2e testing, performance testing usually follow but I usually don't do them at the beginning of a project them unless they are UI centric or have some super specific performance guidelines to meet.

For coverage, I feel that 85% is a proper limit. It is very easy to write bad code if we make reaching 100% a goal always. From experience, code can become more complex just to test a line or two. However, I always strive for 100% if possible.

For libraries, I like to have a standard set of linting rules, coverage rules and even commit rules. This helps keep a project readable and easily maintainable. Following TDD also helps make changes without fear of breaking the world.

### IF I HAD MORE TIME...

If I had more time, I would:

1.  Rework the return structure of what the crawler found. I think the ability to output it to a file will be helpful.
2.  Separate the culebra implementation into it's own module and make the CLI a project that uses it. This will give me more flexibility to use the crawler in other type of applications(for example, a web application).
3.  Refactor tests. There is alot of repetion in some of the tests.
4.  Make the parsing more robust. I'm 100% certain that there are MANY different cases that I did not account for when parsing HTML for internal, external and static content links. A more careful consideration of such scenarios is appropriate.
5.  Add a queue mechanism. The ability to set a limit on how many requests are made will bode well for performance and for users.
6.  Add some visual aids. A log of what the application is loading, a loading bar or something like that can be useful to let a user know that the process is still running and not hanging. Right now it's mostly a run, wait and see for large web pages.
