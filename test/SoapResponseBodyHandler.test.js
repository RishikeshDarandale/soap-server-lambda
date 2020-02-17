const test = require('ava');
const parser = require('fast-xml-parser');

const SoapResponseBodyHandler = require('../src/SoapResponseBodyHandler.js');

const soapResponseHandler = new SoapResponseBodyHandler();


test('When a correct javascript object is passed, a correct soap response should be generated', async t => {
  const response = await soapResponseHandler.generate( {status: 'this operation is successful'} );
  t.assert(parser.validate(response));
});