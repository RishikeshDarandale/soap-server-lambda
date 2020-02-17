'use strict';

const Parser = require('fast-xml-parser').j2xParser;
const SoapError = require('./SoapError.js');

const parser = new Parser();

let soapBodyStart = '<soap:Envelope\n';
soapBodyStart += '	xmlns:soap="http://www.w3.org/2001/12/soap-envelope"\n';
soapBodyStart += '	soap:encodingStyle="http://www.w3.org/2001/12/soap-encoding">\n';
soapBodyStart += '	<soap:Body>\n';

let soapBodyEnd = '	</soap:Body>\n';
soapBodyEnd += '</soap:Envelope>';



class SoapResponseBodyHandler {
  async generate(response) {
    let responseBody = soapBodyStart;
    try {
      responseBody += parser.parse(response);
    } catch(error) {
      console.error(error);
      responseBody += this.fault(new SoapError(500, 'Couldn\'t convert the response in xml'));
			responseBody += '		<soap:faultstring></soap:faultstring>\n';
			responseBody += '	</soap:Fault>\n';
    }
    responseBody += soapBodyEnd;
    return responseBody;
  }

  async fault(error) {
    let soapFault = '<soap:Fault>\n';
    if (error.status) {
      soapFault += '  <soap:faultcode>';
      soapFault += error.status;
      soapFault += '  </soap:faultcode>\n';
    }
    soapFault += '  <soap:faultstring>';
    soapFault += error.message;
    soapFault += '  </soap:faultstring>\n';
    soapFault += '</soap:Fault>\n';
    return soapFault;
  }
}

module.exports = SoapResponseBodyHandler;