'use strict';

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
  addService(name, service) {
    if (!name || !service) {
      throw Error('Either name or service is missing.');
    }
    this.services.set(name, service);
  }
 
  /**
   * Create the lambda handler
   * 
   * @return {function} a lambda handler to handle the incoing event
   */
  createHandler() {
    return async (event, context) => {
      console.log(JSON.stringify(event));
      // check this service exists
      if (this.services.has(event.pathParameters.proxy)) {
        // get calls
        if (event.httpMethod === 'GET' && event.queryStringParameters.wsdl) {
          // return the wsdl  
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