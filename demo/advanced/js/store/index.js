import actions from './actions.js';
import mutations from './mutations.js';
import initialState from './state.js';
import Store from '../lib/terii.js';

export default new Store({
    actions,
    mutations,
    initialState
});
