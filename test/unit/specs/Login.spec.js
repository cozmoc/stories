import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';
import Vuex from 'vuex';
import Login from '@/components/templates/Login';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(Router);

describe('Login', () => {
  let actions;
  let mutations;
  let state;
  let store;
  let router;
  beforeEach(() => {
    actions = {
      clearData: jest.fn(),
      fetchUserProfile: jest.fn(),
      updateProfile: jest.fn(),
    };
    mutations = {
      setCurrentUser: jest.fn(),
    };
    state = {
      currentUser: null,
      userProfile: {},
      payments: { amount: '', description: '' },
      filteredPayments: [],
      currentFilters: [],
      hiddenPayments: [],
      fb: {
        auth: {
          signInWithEmailAndPassword: jest.fn(() =>
            Promise.resolve({ user: { email: 'ahmadalhasancv@gmail.com', password: '123123123' } },
            )),
        },
      },
    };
    store = new Vuex.Store({
      state,
      actions,
      mutations,
    });
    router = new Router();
  });

  it('dispatches profile on login', async () => {
    const wrapper = shallowMount(Login, { store, localVue, router });
    const email = wrapper.find('#email1');
    email.element.value = 'ahmadalhasancv@gmail.com';
    email.trigger('input');

    const password = wrapper.find('#password1');
    password.element.value = '123123123';
    password.trigger('input');

    const button = wrapper.find('#loginButton');
    button.trigger('click');

    expect(store.state.fb.auth.signInWithEmailAndPassword).toHaveBeenCalledWith('ahmadalhasancv@gmail.com', '123123123');
    setImmediate(() => {
      expect(mutations.setCurrentUser).toHaveBeenCalledWith(state, { email: 'ahmadalhasancv@gmail.com', password: '123123123' });
      expect(actions.fetchUserProfile).toHaveBeenCalled();
      expect(router.currentRoute.fullPath).toEqual('/dashboard');
    });
  });
});
