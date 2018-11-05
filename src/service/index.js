import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import data from '../constants/fixtures';

const api = axios.create();

const mock = new MockAdapter(api, { delayResponse: 1000 });

mock.onGet('/products').reply(200, data);

mock.onGet('/actions').reply(() => {
	const random = Math.random() * 100;
	return new Promise(resolve => {
		if (random < 90) {
			resolve([200, { id: 4, name: 'foo' }]);
		} else {
			resolve([500, { success: false }]);
		}
	});
});

export default api;
