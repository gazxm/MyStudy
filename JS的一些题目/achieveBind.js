(function() {
	const obj = {
		a: 1
	};

	const func = function (m, n) {
		console.log(this.a);
		console.log(m);
		console.log(n);
	};

	Function.prototype.bind = function (context) {
		const _this = this;
		const args = Array.prototype.slice.call(arguments, 1);
    return function () {
    	const bindArgs = Array.prototype.slice.call(arguments);
      _this.apply(context, args.concat(bindArgs));
    }
	}

	const m = func.bind(obj, 'm');

	m('n');
})();