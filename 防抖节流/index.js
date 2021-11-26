// 节流
const throttle = (fn, interval) => {
	let timer,
		firstTime = true;

	return function () {
		if (firstTime) {
			fn.apply(this, arguments);
			return (first = false);
		}

		if (timer) return null;

		timer = setTimeout(() => {
			clearTimeout(timer);
			timer = null;
			fn.apply(this, arguments);
		}, interval);
	};
};

// 防抖
const debounce = (fn, interval) => {
	let timer;

	return function () {
		if (!timer) {
			timer = setTimeout(() => {
				timer = null;
				fn.apply(this, arguments);
			}, interval);
		} else {
			clearTimeout(timer);
		}
	};
};
