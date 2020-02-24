'use strict';

const parser = require('fast-xml-parser');
const SoapError = require('./SoapError.js');

/**
 * Soap request handler
 *
 * This class is reponsible for parsing the soap request
 */
class SoapRequestHandler {
  /**
   * Get the operation from the soap request
   *
   * @param {String} body a soap request in xml format
   */
  async getOperation(body) {
    if (parser.validate(body) === true) {
      const parsed = parser.parse(body);
      const envelopeKey = Object.keys(parsed).find((attr) =>
        attr.endsWith(':Envelope'),
      );
      const envelope = parsed[envelopeKey];
      const bodyKey = Object.keys(envelope).find((attr) =>
        attr.endsWith(':Body'),
      );
      if (envelope && envelope[bodyKey]) {
        const soapBody = envelope[bodyKey];
        if (soapBody && Object.keys(soapBody).length > 0) {
          const operation = Object.keys(soapBody).find(
              (attr) => !attr.startsWith('@'),
          );
          const inputs = [];
          for (const [key, value] of Object.entries(soapBody[operation])) {
            // skip the attribute keys
            if (!key.startsWith('@')) {
              inputs.push({
                name: key.substring(
                  key.indexOf(':') !== -1 ? key.indexOf(':') + 1 : 0,
                ),
                value,
              });
            }
          }
          return {
            operation: operation.substring(
              operation.indexOf(':') !== -1 ? operation.indexOf(':') + 1 : 0,
            ),
            inputs,
          };
        }
      }
    }
    throw new SoapError(
        400,
        'Couldn\'t parse the message or correct operation.',
    );
  }
}

module.exports = SoapRequestHandler;
