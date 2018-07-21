import dispatcher from '../../../dispatcher.js';

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