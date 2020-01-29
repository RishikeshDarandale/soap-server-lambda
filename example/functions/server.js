const SoapServer = require('../../src/SoapServer');

const server = new SoapServer();

server.addService(
  'testService',
  {
    wsdlPath: './testService.wsdl',
    impl: 'Mock'
  }
);
exports.handler = server.createHandler();