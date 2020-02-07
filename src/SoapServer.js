'use strict';

const fs = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');

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
          throw Error('Cannot read the wsdl file: ' + this.services[service].wsdlPath);
        }
        const parsed = parser.parse(this.services[service].wsdl);
        console.log(parsed);
      }
    }
  }

  /**
   * Create the lambda handler
   * 
   * @return {function} a lambda handler to handle the incoming event
   */
  createHandler() {
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