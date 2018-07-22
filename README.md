# Bakadux
A dispatcher setup similar to Flux or Redux for React

### Example

Example directory provides all required files to run webpack-serve to compile and open the example in browser. More of a proof of concept then a flushed out example.

```
npm install
npm start
```

### Usage

The code below is just taken from the example, but with more insight as to why and how parts work.

The dispatcher comes with several distinct parts; First is the Dispatcher itself, the dispatcher can access all the stores and actions, as well as modify history.

Within the dispatcher you can make new Store objects that provide state handling. Similar to Redux stores can only be changed through an action, and when a store changes it updates the react elements in the DOM.

The store requires a name to follow it through the flow and default values for it's state.
```javascript
// store.js
import { Store } from 'bakadux';

module.exports = new Store('main', {
    page: 'landing'
});
```

In order to modify the state we have set up above, we need to create an action or set of actions. Actions are simply functions rather  then objects, this means `this` context is less well defined, and thus the dispatcher provides and objects of `{stores, actions, history}` to allow for modification of stores, history, or calling other actions.

Each object sent to CreateActions must include an `actionType` (name to be called) and a `func` (the action itself), and any variables passed to an action will be the second, third, etc passed to the function.

```javascript
// actions.js
import { CreateActions } from 'bakadux';

module.exports = CreateActions([
    {
        actionType: 'togglePage',
        func: ({stores}) => {
        	// The store we named 'main'
            const mainStore = stores.main;
            if (mainStore.get('page') === "Kappa")
                mainStore.set('page', 'Keepo');
            else
                mainStore.set('page', 'Kappa');
        }
    }
]);
```

The dispatcher can also handle state changes caused by navigation (browser History) `dispatcher.setOnHistoryNavigate` functions allows you to set a callback that accepts `{stores, actions, history}` and the state that was popped off the browser history stack.

If you were to navigate back to the origin of the browser history on the website, the state turns into `null`, in order to both avoid issues with that as well as provide useful state information, it is recommended to use `dispatcher.setOriginState`.

In order to know WHERE the user has landed (Say you want to manage where a user goes when they land on a page) you can use `dispatcher.setOnLand` which accepts a callback given `{stores, actions, history, path, redirectOrigin}`.

`redirectOrigin` must be passed a state that is then used as the origin state on the new page, it also modifies the browser history to point to the new origin path

```javascript
// history.js
import dispatcher from 'bakadux';

dispatcher.setOnLand(({stores, path, redirectOrigin}) => {
	let page = 'landing';

	switch(path.toLowerCase()) {
		// Set state for a specific URL
		case '/kappa.html':
			page = path.slice(1, 6);
			dispatcher.setOriginState({page});
			stores.main.set('page', page);
			break;

		// Set state for a specific URL
		case '/keepo.html':
			page = path.slice(1, 6);
			dispatcher.setOriginState({page});
			stores.main.set('page', page);
			break;

		// Set state for the origin
		case '':
			dispatcher.setOriginState({page});
			break;

		// Redirect all pages to the origin with a state
		default:
			redirectOrigin({page});
			break;
	}
});

dispatcher.setOnHistoryNavigate(({stores}, state) => {
	if (state.page)
		stores.main.set('page', state.page);
});
```

Now, if we want to use the actions or stores in react, we can do it several ways. creating a new Store returns a store object that can be accessed directory to get the current state. The CreateActions function returns an object of the actions we made linked to the actionType we gave them.

Optionally, to set the element id that react will render over (default id is `App`), you can pass a string into the `dispatcher.render` function.

```javascript
// index.jsx
import React, { Component } from 'react';

import dispatcher from 'bakadux';

import history from './history';
import store from './store';
import actions from './actions';

/* we can now use
 * dispatcher.actions.togglePage(); or actions.togglePage();
 * dispatcher.store.get('main').get('page'); or store.get('page');
 */

class Page extends Component {
    render() {
        return (
            <section className='app'>
                <h1>{store.get('page')}</h1>
                <button onClick={actions.togglePage}>Click</button>
            </section>
        );
    }
}

// Renders the react to the page and allows the dispatcher to update the state
dispatcher.render(Page, 'App');
```

* Stores are specific contexts that manage themselves, as where actions are context-less and are used to modify stores.
* Stores make up the larger `state` of an application, but do not interact with one another
* Actions don't have a scope like stores do, so you can't make the same actionType twice (The second one will override)
* Actions *MUST* be synchronous
* Both the action and store files have to be included so that they get created, but you don't have to use them (the dispatcher holds all of them)
* `dispatcher.history` is currently just a wrapper around browsers' History object
