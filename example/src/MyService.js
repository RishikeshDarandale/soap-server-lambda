'use strict'

class MyService {
	async MyFunction(myFunctionRequest) {
		if (myFunctionRequest) {
			return {
				status: 'Successful with param: ' + myFunctionRequest.testParam,
			};
		}
		return {
			status: 'Unsuccessful'
		}
	}
}

module.exports = MyService;