const SoapServer = require('../../src/SoapServer');

const MyService = require('../src/MyService');

const server = new SoapServer({
  services: () => {
    return {
      myService: {
        wsdlPath: 'wsdls/MyService.wsdl',
        service:  new MyService(),
      },
    }
  },
});


exports.handler = server.createHandler({debug: true});