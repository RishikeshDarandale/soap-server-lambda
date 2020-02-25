# soap-server-lambda

[![CircleCI](https://circleci.com/gh/RishikeshDarandale/soap-server-lambda.svg?style=svg)](https://circleci.com/gh/RishikeshDarandale/soap-server-lambda)
[![Known Vulnerabilities](https://snyk.io/test/github/RishikeshDarandale/soap-server-lambda/badge.svg)](https://snyk.io/test/github/RishikeshDarandale/soap-server-lambda)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b5521af6e43f477a85b40d146177dc32)](https://www.codacy.com/app/RishikeshDarandale/soap-server-lambda?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=RishikeshDarandale/soap-server-lambda&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/4c6f4aac6d12468c9eb1d2fd0eace794)](https://www.codacy.com/app/RishikeshDarandale/soap-server-lambda?utm_source=github.com&utm_medium=referral&utm_content=RishikeshDarandale/soap-server-lambda&utm_campaign=Badge_Coverage)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=RishikeshDarandale/soap-server-lambda)](https://dependabot.com)
[![npm](https://img.shields.io/npm/v/soap-server-lambda.svg)](https://www.npmjs.com/package/soap-server-lambda)
[![npm](https://img.shields.io/npm/dt/soap-server-lambda.svg)](https://www.npmjs.com/package/soap-server-lambda)
[![NpmLicense](https://img.shields.io/npm/l/soap-server-lambda.svg)](https://github.com/RishikeshDarandale/soap-server-lambda/blob/master/LICENSE)

This is AWS lambda integration for a simple SOAP server.

## A little bit background

There are still a lot of old/legacy project which use SOAP protocol to expose their services. To grab the benefit of AWS serverless services, this is simple try to achieve this step. This project is still matuaring to support all kind of requirements from SOAP world. I will be greatful to all if you want to report an issue or want to contribute in terms of pull request.

## Install

```bash
$npm install --save soap-server-lambda
```

OR

```bash
$yarn add soap-server-lambda
```

## Usage

### Define a service as below and you can use your `WSDL` with this service

```javascript
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
```

### Create a lambda handler as below

```javascript
const SoapServer = require('soap-server-lambda');

const MyService = require('/path/to/MyService');

const server = new SoapServer({
  services: () => {
    return {
      myService: {
        wsdlPath: 'wsdls/MyService.wsdl',
        service: new MyService(),
      },
    };
  },
});

exports.handler = server.createHandler({debug: true});
```

> You have define the name of your function as same to operation name mentioned in your service WSDL file.

# Inspiration and reference

This project took a lot of inspiration and reference from [apollo-server-lambda][1] project.

# Issue or need a new feature?

If you are experiencing a issue or wanted to add a new feature, please create a github issue [here][2].

# Contributing

:star: Star me on GitHub — it helps!

:heart: contribution: Here is [contributing guide][3] in deatil.

For impatient here are quick steps:

- **Fork** the repository
- Create **Branch** in you local repository
- while(youFinish) { **Commit** }
- **Squash** related commits.
- **Write** unit test cases for your work.
- Check the **Build** on your local.
- Raise a **Pull Request** (aka PR)


[1]: https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-lambda
[2]: https://github.com/RishikeshDarandale/apollo-datasource-soap/issues/new
[3]: ./CONTRIBUTING.md