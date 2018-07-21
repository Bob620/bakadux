import React, { Component } from 'react';

import dispatcher from '../../../dispatcher.js';

import history from '../dispatches/history.js';
import store from '../dispatches/main/store.js';
import actions from '../dispatches/main/actions.js';

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

dispatcher.render(Page);