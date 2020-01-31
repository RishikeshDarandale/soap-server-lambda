'use strict';

const fs = require('fs');
const path = require('path');

class SoapServer {

  /**
   * A constructor
   */
  constructor() {
    this.services = new Map(); 
  }

  /**
   * Add the soap service implementation
   * 
   * @param {String} name 
   * @param {Object} service an object with two properties
   *                 wsdlPath as string
   *                 impl as an object of class implementing the service 
   */
  addService(name, serviceConfig) {
    if (!name || !serviceConfig) {
      throw Error('Either name or serviceConfig is missing.');
    }
    try {
      console.log(serviceConfig.wsdlPath)
      serviceConfig.wsdl = fs.readFileSync(path.resolve(serviceConfig.wsdlPath), 'utf-8').toString();
    } catch(exception) {
      throw Error('Cannot read the wsdl file: ' + serviceConfig.wsdlPath);
    }
    this.services.set(name, serviceConfig);
  }

  /**
   * Create the lambda handler
   * 
   * @return {function} a lambda handler to handle the incoming event
   */
  createHandler() {
    return async (event, context) => {
      console.log(JSON.stringify(event));
      // check this service exists
      if (this.services.has(event.pathParameters.proxy)) {
        // get calls
        if (event.httpMethod === 'GET' && event.queryStringParameters.hasOwnProperty('wsdl')) {
          // return the wsdl
          return {
            body: this.services.get(event.pathParameters.proxy).wsdl,
            statusCode: 200,
            headers: {
              'Content-Type': 'application/xml',
            },
          }
        } else if (event.httpMethod === 'POST') {
          // all post calls to service methods

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