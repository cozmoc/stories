export default {
  setCurrentUser(state, val) {
    state.currentUser = val;
  },
  setUserProfile(state, val) {
    state.userProfile = val;
  },
  setPayments(state, val) {
    if (val) {
      state.payments = val;
    } else {
      state.payments = [];
    }
  },
  setFilteredPayments(state, val) {
    if (val) {
      state.filteredPayments = val;
    } else {
      state.filteredPayments = [];
    }
  },
  setFilters(state, val) {
    if (val) {
      state.currentFilters = val;
    } else {
      state.currentFilters = [];
    }
  },
  setHiddenPayments(state, val) {
    if (val) {
      // make sure not to add duplicates
      if (!state.hiddenPayments.some(x => x.id === val.id)) {
        state.hiddenPayments.unshift(val);
      }
    } else {
      state.hiddenPayments = [];
    }
  },
};
