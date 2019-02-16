import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';

import reloadHandler from '../helpers/reloadHandler';
import fb from '../firebaseConfig';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    payments: [],
    filteredPayments: [],
    currentFilters: [],
    hiddenPayments: [],
    fb,
  },
  actions,
  mutations,
});

reloadHandler(store);

export default store;
