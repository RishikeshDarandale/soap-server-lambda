'use strict';

const parser = require('fast-xml-parser');

class SoapRequestHandler {
  async getOperation(body) {
    if(parser.validate(body) === true) {
      const parsed = parser.parse(body);
      const envelopeKey = Object.keys(parsed).find(attr => attr.endsWith(':Envelope'));
      const envelope = parsed[envelopeKey];
      const bodyKey = Object.keys(envelope).find(attr => attr.endsWith(':Body'));
      if (envelope && envelope[bodyKey]) {
        const soapBody = envelope[bodyKey];
          if (soapBody && Object.keys(soapBody).length > 0) {
            const operation = Object.keys(soapBody).find(attr => !attr.startsWith('@'));
            const inputs = [];
            console.log(JSON.stringify(Object.entries(soapBody[operation])));
            for (let [key, value] of Object.entries(soapBody[operation])) {
              // skip the attribute keys
              if (!key.startsWith('@'))
                inputs.push({name: key.substring(key.indexOf(':') !== -1 ? key.indexOf(':') + 1 : 0), value});
            }
            return {
              operation: operation.substring(operation.indexOf(':') !== -1 ? operation.indexOf(':') + 1 : 0),
              inputs,
            }
          }
      }
    }
    throw new Error('Couldn\'t parse the message or correct operation.');
  }
}

module.exports = SoapRequestHandler;