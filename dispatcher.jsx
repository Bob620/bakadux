/**
 * the goal is to be a dispatcher similar to redux/flux, but simplifying amount of files and what they do.
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Store from './store';
import History from './history';

/**
 * Middleware for handling state and updating react dom and browser history
 */
class Dispatcher {
	constructor() {
		const that = this;
		// Needs to give the store the dispatcher, and classes can't use .bind()
		this.Store = class extends Store {constructor(...values) {super(that, ...values);}};
		this.history = new History(this);

		// Easier to handle then action classes, and allows me to return an object of action calls to the user so you
		// can use the action file correctly
		this.CreateActions = actions => {
			let actionFuncs = {};

			for(let {actionType, func} of actions)
				actionFuncs[actionType] = this.data.actionCalls[actionType] = (...values) => {
					func.call(undefined, {
						stores: this.data.storeModify,
						actions: this.data.actionCalls,
						history: this.history
					}, values);
					this.updateStores();
				};

			return actionFuncs;
		};

		// Could most likely get cleaned up
		this.data = {
			stores: new Map(),
			storeModify: {},
			actionCalls: {},
			renderClass: undefined,
			renderLocationId: 'App'
		};
	}

	// User functions for simplicity and debugging and such

	/**
	 * Returns an array of static, user defined action types
	 */
	get actionTypes() {
		return Array.from(this.data.actions.keys());
	}

	/**
	 * Returns an array of static, user defined store types
	 */
	get storeTypes() {
		return Array.from(this.data.stores.keys());
	}

	/**
	 * Returns an object of store objects
	 */
	get stores() {
		return this.data.stores;
	}

	/**
	 * Returns an object of actions in the same format as the user defined
	 * example:
	 * dispatcher.actions.toggleModal()
	 */
	get actions() {
		return this.data.actionCalls;
	}

	/**
	 * Main function used to render react
	 */
	render(UserClass) {
		const that = this;

		// Creates a class that the dispatcher can actually set the state and update it and whatnot
		class MainClass extends Component {
			constructor() {
				super();

				this.state = {
					key: 0
				};

				that.data.renderClass = this.setState.bind(this);
			}

			render() {
				return <UserClass />;
			}
		}

		ReactDOM.render(<MainClass />, document.getElementById(this.data.renderLocationId));
	}

	setRenderLocationId(elementId) {
		this.data.renderLocationId = elementId;
	}

	/**
	 * Sets the onStatePop event to a user defined function
	 */
	setOnHistoryNavigate(func) {
		this.history.data.onStatePop = func;
		this.history.data.onStatePopFunc(history.state);
	}

	/**
	 * Defines a new store, should only be used by the store constructor
	 */
	addStore(storeType, store) {
		this.data.stores.set(storeType, store);
		this.data.storeModify[storeType] = {
			set: store.data.set.bind(store),
			get: store.get.bind(store)
		};
	}

	/**
	 * Force updates all the stores, updating react dom if needed and setting values in the stores to requested values
	 * This should be called synchronously, automatically upon the end of an action
	 */
	updateStores() {
		let storeUpdated = false;

		for (const [, store] of this.data.stores)
			storeUpdated = storeUpdated ? true : store.data.commitChanges();

		if (storeUpdated)
			this.onStoreUpdate();
	}

	/**
	 * Rerenders the react dom if one of the stores' data updates
	 */
	onStoreUpdate() {
		this.data.renderClass(({key}) => {
			return {
				key: key++
			};
		});
	}
}

/**
 * The dispatcher is made here so it can be referenced inside the other classes
 * It can only be made once per load since it handles all the state and history and stuff
 *
 * Technically can load multiple instances of the dispatcher but we will assume it's an npm package where it shouldn't
 */
const dispatcher = new Dispatcher();

module.exports = dispatcher;