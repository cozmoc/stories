export default {
  clearData({ commit }) {
    commit('setCurrentUser', null);
    commit('setUserProfile', {});
    commit('setPayments', null);
    commit('setFilteredPayments', null);
    commit('setFilters', null);
    commit('setHiddenPayments', null);
  },
  fetchUserProfile({ commit, state }) {
    state.fb.usersCollection.doc(state.currentUser.uid).get().then((res) => {
      commit('setUserProfile', res.data());
    }).catch(() => {
      // console.log(err);
    });
  },
  updateProfile({ state }, data) {
    const name = data.name;
    const title = data.title;

    state.fb.usersCollection.doc(state.currentUser.uid).update({ name, title }).then(() => {
      // update all payments by user to reflect new name
      state.fb.paymentsCollection.where('userId', '==', state.currentUser.uid).get().then((docs) => {
        docs.forEach((doc) => {
          state.fb.paymentsCollection.doc(doc.id).update({
            userName: name,
          });
        });
      });
      // update all notes by user to reflect new name
      state.fb.notesCollection.where('userId', '==', state.currentUser.uid).get().then((docs) => {
        docs.forEach((doc) => {
          state.fb.notesCollection.doc(doc.id).update({
            userName: name,
          });
        });
      });
    }).catch(() => {
      // console.log(err);
    });
  },
};

