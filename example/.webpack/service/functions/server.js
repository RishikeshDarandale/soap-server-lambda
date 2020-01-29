module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./functions/server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../src/SoapServer.js":
/*!****************************!*\
  !*** ../src/SoapServer.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nclass SoapServer {\n\n  /**\n   * A constructor\n   */\n  constructor() {\n    this.services = new Map(); \n  }\n\n  /**\n   * Add the soap service implementation\n   * \n   * @param {String} name \n   * @param {Object} service an object with two properties\n   *                 wsdlPath as string\n   *                 impl as an object of class implementing the service \n   */\n  addService(name, service) {\n    if (!name || !service) {\n      throw Error('Either name or service is missing.');\n    }\n    this.services.set(name, service);\n  }\n \n  /**\n   * Create the lambda handler\n   * \n   * @return {function} a lambda handler to handle the incoing event\n   */\n  createHandler() {\n    return async (event, context) => {\n      console.log(JSON.stringify(event));\n      // check this service exists\n      if (this.services.has(event.pathParameters.proxy)) {\n        // get calls\n        if (event.httpMethod === 'GET' && event.queryStringParameters.wsdl) {\n          // return the wsdl  \n        } else if (event.httpMethod === 'POST') {\n          // all post calls to service methods\n\n        }\n      } else {\n        return {\n          body: JSON.stringify({ status: 'NOT FOUND' }),\n          statusCode: 404,\n          headers: {\n            'Content-Type': 'application/json',\n          },\n        }\n      }\n    };\n  }\n}\n\nmodule.exports = SoapServer;\n\n//# sourceURL=webpack://index/../src/SoapServer.js?");

/***/ }),

/***/ "./functions/server.js":
/*!*****************************!*\
  !*** ./functions/server.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const SoapServer = __webpack_require__(/*! ../../src/SoapServer */ \"../src/SoapServer.js\");\n\nconst server = new SoapServer();\n\nserver.addService(\n  'testService',\n  {\n    wsdlPath: './testService.wsdl',\n    impl: 'Mock'\n  }\n);\nexports.handler = server.createHandler();\n\n//# sourceURL=webpack://index/./functions/server.js?");

/***/ })

/******/ });