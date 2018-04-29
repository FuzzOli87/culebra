import createMockServer from '../__tests__/__helpers__/createMockServer';

createMockServer()
  .startServer(3004)
  .then(() => console.log('Server started'))
  .catch(err => console.log('GOT ERROR', err));
