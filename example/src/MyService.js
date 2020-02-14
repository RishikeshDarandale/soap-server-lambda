'use strict'

class MyService {
	async MyFunction(testParam) {
		if (myFunctionRequest) {
			return {
				status: 'Successful with param: ' + testParam,
			};
		}
		return {
			status: 'Unsuccessful'
		}
	}
}

module.exports = MyService;