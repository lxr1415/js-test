const set = new Set();
let id = 0;

const setTimeout = (fn, interval, ...args) => {
	const startTime = Date.now();
	let rid,
		timer = id++;

	set.add(timer);

	const loop = () => {
		if (Date.now() - startTime >= interval) {
			cancelAnimationFrame(rid);
			fn(...args);
		} else if (set.has(timer)) {
			rid = requestAnimationFrame(loop);
		}
	};

	requestAnimationFrame(loop);

	return timer;
};

const clearTimeout = timer => {
	set.delete(timer);
};

let timer = setTimeout(
	(a, b) => {
		console.log(111111, a, b);
	},
	2000,
	2,
	3
);

clearTimeout(timer);

// setInterval

const setInterval = (fn, interval, ...args) => {
	let startTime = Date.now(),
		timer = id++;

	set.add(timer);

	const loop = () => {
		let now = Date.now();
		if (now - startTime >= interval) {
			startTime = now;
			fn(...args);
		}

		set.has(timer) && requestAnimationFrame(loop);
	};

	requestAnimationFrame(loop);

	return timer;
};

const clearInterval = timer => {
	set.delete(timer);
};

let timer2 = setInterval(
	(a, b) => {
		console.log(111111, a, b);
	},
	1000,
	2,
	3
);

clearInterval(timer2);
