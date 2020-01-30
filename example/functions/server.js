const SoapServer = require('../../src/SoapServer');

const MyService = require('../src/MyService');

const server = new SoapServer();

server.addService(
  'MyService',
  {
    wsdlPath: 'wsdls/MyService.wsdl',
    impl: new MyService(),
  }
);
exports.handler = server.createHandler();