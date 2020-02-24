'use strict';

/**
 * Sample MyService
 */
class MyService {
  /**
   * Test function method
   *
   * @param {String} testParam
   */
  async MyFunction(testParam) {
    if (testParam) {
      return {
        status: 'Successful with param: ' + testParam,
      };
    }
    return {
      status: 'Unsuccessful',
    };
  }
}

module.exports = MyService;
