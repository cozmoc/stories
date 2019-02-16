// handle page reload
export default store => store.state.fb.auth.onAuthStateChanged((user) => {
  if (user) {
    store.commit('setCurrentUser', user);
    store.dispatch('fetchUserProfile');

    store.state.fb.usersCollection.doc(user.uid).onSnapshot((doc) => {
      store.commit('setUserProfile', doc.data());
    });

    // realtime updates from our payments collection
    // add .where('userId', '==', user.uid) for private payments!! :)
    store.state.fb.paymentsCollection.orderBy('createdOn', 'desc').onSnapshot((querySnapshot) => {
      // check if created by currentUser
      let createdByCurrentUser;
      if (querySnapshot.docs.length) {
        createdByCurrentUser = store.state.currentUser.uid ===
          querySnapshot.docChanges()[0].doc.data().userId;
      }

      // add new payments to hiddenPayments array after initial load
      if (querySnapshot.docChanges().length !== querySnapshot.docs.length
        && querySnapshot.docChanges()[0].type === 'added' && !createdByCurrentUser) {
        const payment = querySnapshot.docChanges()[0].doc.data();
        payment.id = querySnapshot.docChanges()[0].doc.id;

        store.commit('setHiddenPayments', payment);
      } else {
        const paymentsArray = [];

        querySnapshot.forEach((doc) => {
          const payment = doc.data();
          payment.id = doc.id;
          paymentsArray.push(payment);
        });

        store.commit('setPayments', paymentsArray);
        store.commit('setFilteredPayments', paymentsArray);

        const paymentsFilters = [...paymentsArray.map(p => Object.values(p))];
        const filters = [];
        if (paymentsFilters[0]) {
          paymentsFilters[0].forEach((p, i) => {
            filters[Object.keys(paymentsArray[0])[i]] = [...new Set(
              paymentsFilters.map(el => el[i]),
            )];
          });
        }
        store.commit('setFilters', filters);
      }
    });
  }
});
