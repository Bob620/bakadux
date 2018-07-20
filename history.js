module.exports = class History {
	constructor(dispatcher) {
		this.data = {
			dispatcher,
			originState: {},
			onStatePop: undefined,
			onStatePopFunc: histEvent => {
				if (this.data.onStatePop) {
					this.data.onStatePop.call(undefined, {
						stores: dispatcher.data.storeModify,
						actions: dispatcher.data.actionCalls,
						history: this
					}, histEvent && histEvent.state ? histEvent.state : this.data.originState);

					dispatcher.updateStores();
				} else {
					console.warn('No state pop handler!');
				}
			}
		};

		window.addEventListener('popstate', this.data.onStatePopFunc.bind(this));
	}

	// For Consistency and future expansion, implement the builtin history functions

	pushState(state, url) {
		history.pushState(state, '', url);
	}

	replaceState(state, url) {
		history.replaceState(state, '', url);
	}

	forward() {
		history.forward();
	}

	back() {
		history.back();
	}
};