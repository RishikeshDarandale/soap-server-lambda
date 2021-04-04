'use strict';

const log = require('lambda-log');
const Parser = require('fast-xml-parser').j2xParser;
const SoapError = require('./SoapError.js');

const parser = new Parser();

let xmlns_soap = 'http://www.w3.org/2001/12/soap-envelope';
let soap_es    = 'http://www.w3.org/2001/12/soap-encoding';

let soapBodyStart = '<soap:Envelope\n';
soapBodyStart += '  xmlns:soap="'         + xmlns_soap + '"\n';
soapBodyStart += '  soap:encodingStyle="' + soap_es    + '">\n';
soapBodyStart += '  <soap:Body>\n';

let soapBodyEnd = ' </soap:Body>\n';
soapBodyEnd += '</soap:Envelope>';

/**
 * Soap response body handler class
 *
 * This class will be responsible for creating the soap response from the actual response.
 */
class SoapResponseBodyHandler {

  //Handle customized namespaces from server object
  constructor(servobj = null) {
    //log.debug("SoapResponseBodyHandler constructor called", servobj);
    if(servobj !== null) {
      configure(servobj);
    }
  } //end constructor

  //Configure header accordingly to server definition
  async configure(servobj) {
    //log.debug("SoapResponseBodyHandler configure called", servobj);
    if(servobj !== null  && typeof servobj === 'object') {
      
      if('xmlns_soap' in servobj) {
        xmlns_soap = servobj.xmlns_soap;
      }
    
      if('soap_es' in servobj) {
        soap_es = servobj.soap_es;
      }
    
     soapBodyStart = '<soap:Envelope\n' +
                          '  xmlns:soap="'         + xmlns_soap + '"\n' +
                          '  soap:encodingStyle="' + soap_es    + '">\n' +
                          '  <soap:Body>\n';
    }
  }

  /**
   * Build the success response from the actual response object
   *
   * @param {Object} response the response object
   */
  async success(response) {
    //log.debug("SUCCESS called, soapBodyStart is ", soapBodyStart);
    let responseBody = soapBodyStart;
    try {
      responseBody += parser.parse(response);
    } catch (error) {
      console.error(error);
      responseBody += this.fault(
          new SoapError(500, 'Couldn\'t convert the response in xml'),
      );
      responseBody += '  <soap:faultstring></soap:faultstring>\n';
      responseBody += ' </soap:Fault>\n';
    }
    responseBody += soapBodyEnd;
    return responseBody;
  }

  /**
   * Build the error/fault response
   *
   * @param {SoapError} error the error object
   */
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
    return soapBodyStart + soapFault + soapBodyEnd;
  }
}

module.exports = SoapResponseBodyHandler;
