module.exports = class History {
	constructor(dispatcher) {
		this.data = {
			dispatcher,
			onStatePop: undefined,
			onStatePopFunc: state => {
				if (this.data.onStatePop) return this.data.onStatePop(state);

				return () => {
					console.warn('No state pop handler!');
				};
			}
		};

		window.addEventListener('popstate', this.data.onStatePopFunc.bind(this));
	}

	// For Consistency and future expansion, implement the builtin history functions

	pushState(state) {
		history.pushState(state);
	}

	replaceState(state) {
		history.replaceState(state);
	}

	forward() {
		history.forward();
	}

	back() {
		history.back();
	}
};