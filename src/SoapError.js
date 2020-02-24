'use strict';

/**
 * SOAP error class
 */
class SoapError extends Error {
  /**
   * The constructor
   *
   * @param {Integer} status
   * @param {String} message
   */
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = SoapError;
