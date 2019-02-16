import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';
import Vuex from 'vuex';
import mutations from '@/store/mutations';
import Dashboard from '@/components/templates/Dashboard';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(Router);
localVue.component('v-icon', {});

describe('Dashboard', () => {
  let actions;
  let state;
  let store;
  let router;
  let currentPayment;
  let currentNote;
  beforeAll(() => {
    actions = {
      clearData: jest.fn(),
      fetchUserProfile: jest.fn(),
      updateProfile: jest.fn(),
    };
    state = {
      currentUser: { name: 'Ahmad', title: 'Developer', uid: 1 },
      userProfile: { name: 'Ahmad', title: 'Developer', uid: 1 },
      payments: [],
      filteredPayments: [],
      currentFilters: {},
      hiddenPayments: [],
      fb: {
        paymentsCollection: {
          add: jest.fn((payment) => {
            currentPayment = payment;
            return Promise.resolve(payment);
          }),
          doc: jest.fn(id => ({
            update: (newData) => {
              currentPayment = {
                ...currentPayment,
                ...newData,
              };
              return Promise.resolve(newData);
            },
          })),
        },
        notesCollection: {
          add: jest.fn((note) => {
            currentNote = note;
            return Promise.resolve(note);
          }),
          where: jest.fn(() => ({ get: (a, b, c) => Promise.resolve(currentNote ? [currentNote] : []) })),
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

  it('should add payments on Dashboard', () => {
    const wrapper = shallowMount(Dashboard, { store, localVue, router });
    const amount = wrapper.find('.create-payment .amount');
    amount.element.value = '30';
    amount.trigger('input');

    const description = wrapper.find('.create-payment .description');
    description.element.value = 'test descriptions';
    description.trigger('input');

    const addPaymentBtn = wrapper.find('.create-payment .button');
    addPaymentBtn.trigger('click');

    expect(store.state.fb.paymentsCollection.add).toHaveBeenCalledWith(currentPayment);
    const newPayment = { ...currentPayment, createdOn: null, id: 123 };
    store.commit('setFilteredPayments', [newPayment]);
    store.commit('setPayments', [newPayment]);
    expect(store.state.filteredPayments[0]).toEqual(newPayment);
  });

  it('should update description of the payment', async () => {
    const wrapper = shallowMount(Dashboard, { store, localVue, router });

    const viewPayment = wrapper.find('.view-payment');
    viewPayment.trigger('click');

    await new Promise((resolve) => {
      setTimeout(() => {
        const description = wrapper.find('.p-container .payment #description');
        description.element.value = 'test description 2';
        description.trigger('input');

        const updateDesc = wrapper.find('.payment button');
        updateDesc.trigger('click');

        expect(store.state.fb.paymentsCollection.doc).toHaveBeenCalledWith(store.state.payments[0].id);
        resolve();
      });
    });
  });

  it('should add new note to the payment', async () => {
    const wrapper = shallowMount(Dashboard, { store, localVue, router });

    const viewPayment = wrapper.find('.view-payment');
    viewPayment.trigger('click');

    await new Promise((resolve) => {
      setTimeout(() => {
        const addNoteBtn = wrapper.find('.add-note');
        addNoteBtn.trigger('click');

        const noteDesc = wrapper.find('.c-container textarea');
        noteDesc.element.value = 'test note descriptions';
        noteDesc.trigger('input');

        const addNoteBtnCall = wrapper.find('.c-container .button');
        addNoteBtnCall.trigger('click');

        expect(store.state.fb.notesCollection.add).toHaveBeenCalledWith(currentNote);
        expect(store.state.fb.notesCollection.where).toHaveBeenCalled();
        resolve();
      });
    });
  });
});
