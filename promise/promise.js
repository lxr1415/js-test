const STATE = {
	PENDING: 'pending',
	FULFILLED: 'fulfilled',
	REJECT: 'reject',
};

class MyPromise {
	constructor(executor) {
		try {
			executor(this.resolve, this.reject);
		} catch (error) {
			this.reject(error);
		}
	}

	state = STATE.PENDING;

	result = null;

	callbacks = [];

	resolve = value => {
		if (this.state != STATE.PENDING) return;

		this.state = STATE.FULFILLED;
		this.result = value;

		this.callbacks.forEach(callback => callback.onFulfilled(value));
	};

	reject = reason => {
		if (this.state != STATE.PENDING) return;

		this.state = STATE.REJECT;
		this.result = reason;

		this.callbacks.forEach(callback => callback.onRejected(reason));
	};

	then(onFulfilled, onRejected) {
		if (typeof onFulfilled != 'function') onFulfilled = value => value;
		if (typeof onRejected != 'function')
			onRejected = reason => {
				throw reason;
			};

		const promise = new MyPromise((resolve, reject) => {
			const handle = fn => {
				queueMicrotask(() => {
					try {
						let x = fn(this.result);

						resolvePromise(promise, x, resolve, reject);
					} catch (error) {
						reject(error);
					}
				});
			};

			if (this.state == STATE.FULFILLED) {
				handle(onFulfilled);
			} else if (this.state == STATE.REJECT) {
				handle(onRejected);
			} else if (this.state == STATE.PENDING) {
				this.callbacks.push({
					onFulfilled: () => {
						handle(onFulfilled);
					},
					onRejected: () => {
						handle(onRejected);
					},
				});
			}
		});

		return promise;
	}

	catch(onRejected) {
		return this.then(null, onRejected);
	}

	static resolve = parameter => {
		if (parameter instanceof MyPromise) {
			return parameter;
		}

		return new MyPromise(resolve => {
			resolve(parameter);
		});
	};
 
	static reject = reason => {
		return new MyPromise((_, reject) => {
			reject(reason);
		});
	};
}

// function resolvePromise(promise, x, resolve, reject) {
// 	// 如果相等了，说明return的是自己，抛出类型错误并返回
// 	if (promise === x) {
// 		return reject(new TypeError('The promise and the return value are the same'));
// 	}

// 	if (typeof x === 'object' || typeof x === 'function') {
// 		// x 为 null 直接返回，走后面的逻辑会报错
// 		if (x === null) {
// 			return resolve(x);
// 		}

// 		let then;
// 		try {
// 			// 把 x.then 赋值给 then
// 			then = x.then;
// 		} catch (error) {
// 			// 如果取 x.then 的值时抛出错误 error ，则以 error 为据因拒绝 promise
// 			return reject(error);
// 		}

// 		// 如果 then 是函数
// 		if (typeof then === 'function') {
// 			let called = false;
// 			try {
// 				then.call(
// 					x, // this 指向 x
// 					// 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
// 					y => {
// 						// 如果 resolvePromise 和 rejectPromise 均被调用，
// 						// 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
// 						// 实现这条需要前面加一个变量 called
// 						if (called) return;
// 						called = true;
// 						resolvePromise(promise, y, resolve, reject);
// 					},
// 					// 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
// 					r => {
// 						if (called) return;
// 						called = true;
// 						reject(r);
// 					}
// 				);
// 			} catch (error) {
// 				// 如果调用 then 方法抛出了异常 error：
// 				// 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
// 				if (called) return;

// 				// 否则以 error 为据因拒绝 promise
// 				reject(error);
// 			}
// 		} else {
// 			// 如果 then 不是函数，以 x 为参数执行 promise
// 			resolve(x);
// 		}
// 	} else {
// 		// 如果 x 不为对象或者函数，以 x 为参数执行 promise
// 		resolve(x);
// 	}
// }
function resolvePromise(promise, x, resolve, reject) {
	if (promise == x) {
		return reject(new TypeError('The promise and the return value are the same'));
	}

	if (x instanceof MyPromise) {
		try {
			x.then(resolve, reject);
		} catch (error) {
			reject(error);
		}
	} else {
		resolve(x);
	}

	// if(typeof promise == 'object' || typeof promise == 'function') {

	// }
}

MyPromise.deferred = function () {
	var result = {};
	result.promise = new MyPromise(function (resolve, reject) {
		result.resolve = resolve;
		result.reject = reject;
	});

	return result;
};

module.exports = MyPromise;
