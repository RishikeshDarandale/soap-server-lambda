const test = require('ava');

const SoapRequestHandler = require('../src/SoapRequestHandler.js');

const soapRequestHandler = new SoapRequestHandler();

test('When incorrect soap message is passed, then should throw an error', async (t) => {
  const request =
    '<?xml version = "1.0"?>' +
    '<SOAP-ENV:Envelope ' +
    '  xmlns:SOAP-ENV = "http://www.w3.org/2001/12/soap-envelope"' +
    '  SOAP-ENV:encodingStyle = "http://www.w3.org/2001/12/soap-encoding">' +
    '  <SOAP-ENV:Body xmlns:m = "http://www.xyz.org/quotations">' +
    '    <m:GetQuotation>' +
    '      <m:QuotationsName>MiscroSoft</m:QuotationsName>' +
    '    </m:GetQuotation>' +
    '  </SOAP-ENV:Body>';
  await t.throwsAsync(soapRequestHandler.getOperation(request), {
    instanceOf: Error,
    message: 'Couldn\'t parse the message or correct operation.',
  });
});

test('When correct soap message is passed, it should return the correct operation', async (t) => {
  const request =
    '<?xml version = "1.0"?>' +
    '<SOAP-ENV:Envelope ' +
    '  xmlns:SOAP-ENV = "http://www.w3.org/2001/12/soap-envelope"' +
    '  SOAP-ENV:encodingStyle = "http://www.w3.org/2001/12/soap-encoding">' +
    '  <SOAP-ENV:Body xmlns:m = "http://www.xyz.org/quotations">' +
    '    <m:GetQuotation>' +
    '      <m:QuotationsName>MiscroSoft</m:QuotationsName>' +
    '    </m:GetQuotation>' +
    '  </SOAP-ENV:Body>' +
    '</SOAP-ENV:Envelope>';
  const response = await soapRequestHandler.getOperation(request);
  t.deepEqual(response, {
    operation: 'GetQuotation',
    inputs: [{name: 'QuotationsName', value: 'MiscroSoft'}],
  });
});

test('When correct soap message in lowercase is passed, it should return the correct operation', async (t) => {
  const request =
    '<?xml version = "1.0"?>' +
    '<soapenv:Envelope ' +
    '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    '  xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    '  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' +
    '  xmlns:urn="urn:localhost:MyService">' +
    '  <soapenv:Header/>' +
    '  <soapenv:Body>' +
    '    <urn:MyFunction soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
    '      <testParam xsi:type="xsd:string">Hello</testParam>' +
    '    </urn:MyFunction>' +
    '  </soapenv:Body>' +
    '</soapenv:Envelope>';
  const response = await soapRequestHandler.getOperation(request);
  t.deepEqual(response, {
    operation: 'MyFunction',
    inputs: [{name: 'testParam', value: 'Hello'}],
  });
});
