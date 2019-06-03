/*
 * Boilerplate for creating and modifying stores
 */
module.exports = class Store {
	constructor(dispatcher, storeType, defaultData={}) {
		/*
		 * Most of this is for handling changes and updating the store in a secure way
		 */
		this.data = {
			dispatcher,
			type: storeType,
			storage: defaultData,
			changes: new Map(),
			set: (key, value) => this.data.changes.set(key, value),
			commitChanges: () => {
				if (this.data.changes.size > 0) {
					for (const [key, value] of this.data.changes)
						this.data.storage[key] = value;

					this.data.changes = new Map();
					return true;
				}
				return false;
			}
		};

		dispatcher.addStore(storeType, this);
	}

	/*
	 * Gets values from the store
	 */
	get(key) {
		return this.data.storage[key];
	}

	getKeys() {
		return Object.keys(this.data.storage);
	}
};