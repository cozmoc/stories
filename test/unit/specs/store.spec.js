import mutations from '@/store/mutations';
import actions from '@/store/actions';
import reloadHandler from '@/helpers/reloadHandler';

jest.mock('@/firebaseConfig');

// mutations
test('setPayments updates state with Payments in payload', () => {
  const state = {
    payments: [],
  };
  const payments = [
    {
      amount: 1,
      description: 'test',
    },
    {
      amount: 2,
      description: 'test2',
    },
  ];
  mutations.setPayments(state, payments);
  expect(state.payments).toBe(payments);
});

// reloadHandler
test('reloadHandler commits currentUser returned by fb method', async () => {
  const currentUser = { name: 'Ahmad Alhasan', title: 'Developer', uid: 123123 };
  const state = {
    fb: {
      db: jest.fn(),
      auth: { onAuthStateChanged: c => c(currentUser) },
      currentUser: jest.fn(),
      usersCollection: { doc: () => ({ onSnapshot: c => c({ data: () => currentUser }) }) },
      paymentsCollection: {
        orderBy: () => ({
          onSnapshot: c => c({
            docs: [],
            docChanges: () => [],
            forEach: () => {},
          }),
        }),
      },
      notesCollection: jest.fn(),
    },
  };
  const commit = jest.fn();
  const dispatch = jest.fn();
  await reloadHandler({ commit, state, dispatch });
  expect(commit).toHaveBeenCalledWith('setFilters', []);
  expect(commit).toHaveBeenCalledWith('setFilteredPayments', []);
  expect(commit).toHaveBeenCalledWith('setPayments', []);
});

// actions
test('action should update profile', async () => {
  const currentUser = { name: 'Ahmad Alhasan', title: 'Developer', uid: 123123 };
  let output = null;
  const state = {
    currentUser,
    fb: {
      db: jest.fn(),
      auth: { onAuthStateChanged: c => c(currentUser) },
      currentUser: jest.fn(),
      usersCollection: { doc: () => ({ update: (data) => {
        output = data;
        return Promise.resolve();
      } }) },
      paymentsCollection: {
        where: () => ({
          get: () => Promise.resolve([]),
        }),
      },
      notesCollection: {
        where: () => ({
          get: () => Promise.resolve([]),
        }),
      },
    },
  };
  const commit = jest.fn();
  const dispatch = jest.fn();
  await actions.updateProfile({ commit, state, dispatch }, { name: 'Phil Reynolds', title: 'CEO' });
  expect(output).toEqual({ name: 'Phil Reynolds', title: 'CEO' });
});
