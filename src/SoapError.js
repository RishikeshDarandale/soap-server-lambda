'use strict';

class SoapError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = SoapError;
