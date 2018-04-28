import http from 'http';
import path from 'path';
import hock from 'hock';
import { promisify } from 'util';

export default function createMockServer() {
  const mock = hock.createHock();
  mock
    .get('/')
    .replyWithFile(200, path.resolve(__dirname, '../__fixtures__/web/index.html'))
    .get('/noextension')
    .replyWithFile(200, path.resolve(__dirname, '../__fixtures__/web/nothing.html'))
    .get('/values.html')
    .replyWithFile(200, path.resolve(__dirname, '../__fixtures__/web/values.html'))
    .get('/dogs/dogs.html')
    .replyWithFile(200, path.resolve(__dirname, '../__fixtures__/web/dogs/dogs.html'))
    .get('/dogs/small.html')
    .replyWithFile(200, path.resolve(__dirname, '../__fixtures__/web/dogs/small.html'))
    .get('/cats/cats.html')
    .replyWithFile(200, path.resolve(__dirname, '../__fixtures__/web/cats/cats.html'));

  const server = http.createServer(mock.handler);

  server.listen = promisify(server.listen);
  server.close = promisify(server.close);

  return {
    startServer(port) {
      return server.listen(port);
    },
    stopServer() {
      return server.close();
    }
  };
}
