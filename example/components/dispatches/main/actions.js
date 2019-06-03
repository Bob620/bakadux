import { CreateActions } from '../../../../dispatcher.js';

export default CreateActions([
	{
		actionType: 'togglePage',
		func: ({stores, history}) => {
			const mainStore = stores.main;

			console.log(mainStore.getKeys());

			// Changes the page
			if (mainStore.get('page') === "Kappa") {
				mainStore.set('page', 'Keepo');
				// State with a URL for history navigation
				history.pushState({page: 'Keepo'}, '/keepo.html');
			} else {
				mainStore.set('page', 'Kappa');
				history.pushState({page: 'Kappa'}, '/kappa.html');
			}
		}
	}
]);