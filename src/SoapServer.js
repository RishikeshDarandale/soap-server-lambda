'use strict';

const fs = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');
const log = require('lambda-log');

const SoapRequestHandler = require('./SoapRequestHandler.js');
const SoapResposeHandler = require('./SoapResponseBodyHandler.js');
const SoapError = require('./SoapError.js');

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
    // configure the server options
    if(options) {
      log.options.debug = options.debug ? true: false;
    }
    return async (event, context) => {
      log.debug('Received an event', event);
      // check this service exists
      if (this.services.hasOwnProperty(event.pathParameters.proxy)) {
        log.info('Received a request for service', {service: event.pathParameters.proxy});
        // get calls
        if (event.httpMethod === 'GET' && event.queryStringParameters.hasOwnProperty('wsdl')) {
          log.info('Received a request for wsdl', {service: event.pathParameters.proxy});
          log.debug('The wsdl is: ', this.services[event.pathParameters.proxy].wsdl);
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
          let requestOperation;
          try {
            requestOperation = await soapRequestHandler.getOperation(event.body);
            log.debug('Received a request for an operation: ', requestOperation);
          } catch(error) {
            log.error(error);
            return {
              body: SoapResposeHandler.fault(error),
              statusCode: error.status ? error.status : 500,
              headers: {
                'Content-Type': 'application/xml',
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
            if (serviceimpl[requestOperation.operation]) {
              response = await serviceimpl[requestOperation.operation].apply(null, params);
              log.debug('The response received from server', response);
            } else {
              throw new SoapError(501, 'Operation didn\'t implemented');
            }
            const responseBody = await soapReponseHandler.success(response);
            log.debug('Sending the reponse body as: ', responseBody);
            return {
              body: responseBody,
              statusCode: 200,
              headers: {
                'Content-Type': 'application/xml',
              },
            }
          } catch(error) {
            log.error(error);
            return {
              body: await soapReponseHandler.fault(error),
              statusCode: error.status ? error.status : 500,
              headers: {
                'Content-Type': 'application/xml',
              },
            }
          }
        }
      } else {
        log.error('The service not found');
        log.debug('Available services are:', this.services);
        return {
          body: await soapReponseHandler.fault(new SoapError(404, 'Service not found')),
          statusCode: 404,
          headers: {
            'Content-Type': 'application/xml',
          },
        }
      }
    };
  }
}

module.exports = SoapServer;