'use strict';

const fs = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');
const log = require('lambda-log');

const SoapRequestHandler = require('./SoapRequestHandler.js');
const SoapResposeHandler = require('./SoapResponseBodyHandler.js');

const soapRequestHandler = new SoapRequestHandler();
const soapReponseHandler = new SoapResposeHandler();

class SoapServer {

  /**
   * A constructor
   */
  constructor(config) {
    this.services = {};
    if (config.services && typeof config.services === 'function') {
      Object.assign(this.services, config.services());
      for(const service in this.services) {
        try {
          this.services[service].wsdl = fs.readFileSync(path.resolve(this.services[service].wsdlPath), 'utf-8').toString();
        } catch (error) {
          throw new Error('Cannot read the wsdl file: ' + this.services[service].wsdlPath);
        }
        if( parser.validate(this.services[service].wsdl) !== true) {
          throw new Error('Cannot parse the wsdl file correctly: ' + this.services[service].wsdlPath);
        }
        const parsed = parser.parse(this.services[service].wsdl, { ignoreAttributes: false });
      }
    }
  }

  /**
   * Create the lambda handler
   * 
   * @return {function} a lambda handler to handle the incoming event
   */
  createHandler(options) {
    log.options.debug = options.debug ? true: false;
    return async (event, context) => {
      // check this service exists
      if (this.services.hasOwnProperty(event.pathParameters.proxy)) {
        // get calls
        if (event.httpMethod === 'GET' && event.queryStringParameters.hasOwnProperty('wsdl')) {
          // return the wsdl
          return {
            body: this.services[event.pathParameters.proxy].wsdl,
            statusCode: 200,
            headers: {
              'Content-Type': 'application/xml',
            },
          }
        } else if (event.httpMethod === 'POST') {
          // all post calls to service methods
          log.debug(JSON.stringify(event));
          let requestOperation;
          try {
            requestOperation = await soapRequestHandler.getOperation(event.body);
            console.log(JSON.stringify(requestOperation));
          } catch(error) {
            return {
              body: JSON.stringify({ status: 'Bad Request' }),
              statusCode: 400,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          }
          // get the implementation from the service
          const serviceimpl = this.services[event.pathParameters.proxy].service;
          // invoke the method with argument
          let response;
          try {
            // get the input params
            let params;
            if (requestOperation.inputs) {
              params = requestOperation.inputs.map(input => input.value);
            }
            response = await serviceimpl[requestOperation.operation].apply(null, params);
            return {
              body: await soapReponseHandler.generate(response),
              statusCode: 200,
              headers: {
                'Content-Type': 'application/xml',
              },
            }
          } catch(error) {
            return {
              body: await soapReponseHandler.fault(error),
              statusCode: 200,
              headers: {
                'Content-Type': 'application/xml',
              },
            }
          }
        }
      } else {
        return {
          body: JSON.stringify({ status: 'NOT FOUND' }),
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      }
    };
  }
}

module.exports = SoapServer;