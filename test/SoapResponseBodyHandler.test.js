const test = require('ava');
const parser = require('fast-xml-parser');

const SoapResponseBodyHandler = require('../src/SoapResponseBodyHandler.js');
const SoapError = require('../src/SoapError.js');

const soapResponseHandler = new SoapResponseBodyHandler();

test('When a correct javascript object is passed, a correct soap response should be generated', async (t) => {
  const response = await soapResponseHandler.success({
    status: 'this operation is successful',
  });
  t.assert(parser.validate(response));
});

test('When a error object is passed, a correct fault soap response should be generated', async (t) => {
  const error = await soapResponseHandler.fault(
      new Error('Something went wrong'),
  );
  t.assert(parser.validate(error));
  const errorObj = parser.parse(error);
  t.is(
      errorObj['soap:Envelope']['soap:Body']['soap:Fault']['soap:faultstring'],
      'Something went wrong',
  );
});

test('When a soap error object is passed, a correct fault soap response should be generated', async (t) => {
  const error = await soapResponseHandler.fault(
      new SoapError(400, 'Bad Request'),
  );
  t.assert(parser.validate(error));
  const errorObj = parser.parse(error);
  t.is(
      errorObj['soap:Envelope']['soap:Body']['soap:Fault']['soap:faultcode'],
      400,
  );
  t.is(
      errorObj['soap:Envelope']['soap:Body']['soap:Fault']['soap:faultstring'],
      'Bad Request',
  );
});
