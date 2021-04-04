'use strict';

const fs = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');
const log = require('lambda-log');

const SoapRequestHandler  = require('./SoapRequestHandler.js');
const SoapResponseHandler = require('./SoapResponseBodyHandler.js');
const SoapError = require('./SoapError.js');

const soapRequestHandler  = new SoapRequestHandler();
const soapResponseHandler = new SoapResponseHandler();

/**
 * Soap Server
 */
class SoapServer {
  /**
   * A constructor
   *
   * @param {Object} config the configuration object for soap server
   */
  constructor(config) {
    this.services = {};
    if (config.services && typeof config.services === 'function') {
      Object.assign(this.services, config.services());
      for (const service in this.services) {
        if (Object.prototype.hasOwnProperty.call(this.services, service)) {
          try {
            // get the
            this.services[service].wsdl = fs
                .readFileSync(
                    path.resolve(this.services[service].wsdlPath),
                    'utf-8',
                )
                .toString();
          } catch (error) {
            throw new Error(
                'Cannot read the wsdl file: ' + this.services[service].wsdlPath,
            );
          }
          if (parser.validate(this.services[service].wsdl) !== true) {
            throw new Error(
                'Cannot parse the wsdl file correctly: ' +
                this.services[service].wsdlPath,
            );
          }
        }
      }
    }
  }

  /**
   * Create the lambda handler
   *
   * @param {Object} options options object to create a lambda handler
   * @return {function} a lambda handler to handle the incoming event
   */
  createHandler(options) {
    // configure the server options
    if (options) {
      log.options.debug = options.debug ? true : false;
    }
    return async (event, context) => {
      //log.debug("event", event);
      // check this service exists
      if (event.pathParameters != null && this.services.hasOwnProperty(event.pathParameters.proxy)) {
        log.info('Received a request for service', {
          service: event.pathParameters.proxy,
        });

        //get optionally enforced content type used in responses
        var contentType = ('contentType' in this.services[event.pathParameters.proxy])? this.services[event.pathParameters.proxy].contentType : 'application/xml';
        await soapResponseHandler.configure(this.services[event.pathParameters.proxy]);

        // get calls
        if (
          event.httpMethod === 'GET' &&
          event.queryStringParameters.hasOwnProperty('wsdl')
        ) {
          log.info('Received a request for wsdl', {
            service: event.pathParameters.proxy,
          });
          // return the wsdl
          return {
            body: this.services[event.pathParameters.proxy].wsdl,
            statusCode: 200,
            headers: {
              'Content-Type': contentType,
            },
          };
        } else if (event.httpMethod === 'POST') {

          // all post calls to service methods
          let requestOperation;
          try {
            requestOperation = await soapRequestHandler.getOperation(
                event.body,
            );
            log.info(
                'Received a request for an operation: ',
                requestOperation,
            );
          } catch (error) {
            log.error(error);
            return {
              body: soapResponseHandler.fault(error),
              statusCode: error.status ? error.status : 500,
              headers: {
                'Content-Type': contentType,
              },
            };
          }
          // get the implementation from the service
          const serviceimpl = this.services[event.pathParameters.proxy].service;
          // invoke the method with argument
          let response;
          try {
            // get the input params
            let params;
            if (requestOperation.inputs) {
              params = requestOperation.inputs.map((input) => input.value);
            }
            if (serviceimpl[requestOperation.operation]) {
              response = await serviceimpl[requestOperation.operation].apply(
                  null,
                  params,
              );
              //log.debug('The response received from server', response);
            } else {
              throw new SoapError(501, 'Operation was not implemented');
            }
            const responseBody = await soapResponseHandler.success(response);
            //log.debug('Sending the reponse body as: ', responseBody);
            return {
              body: responseBody,
              statusCode: 200,
              headers: {
                'Content-Type': contentType,
              },
            };
          } catch (error) {
            log.error(error);
            return {
              body: await soapResponseHandler.fault(error),
              statusCode: error.status ? error.status : 500,
              headers: {
                'Content-Type': contentType,
              },
            };
          }
        }
      } else {
        log.error('The service was not found');
        log.debug('Available services are:', this.services);
        return {
          body: await soapResponseHandler.fault(
              new SoapError(404, 'Service not found'),
          ),
          statusCode: 404,
          headers: {
            'Content-Type': contentType,
          },
        };
      }
    };
  }
}

module.exports = SoapServer;
