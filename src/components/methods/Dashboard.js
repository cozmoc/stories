export default {
  createPayment() {
    this.performingRequest = true;
    this.fb.paymentsCollection
      .add({
        createdOn: new Date(),
        description: this.payment.description,
        amount: this.payment.amount,
        userId: this.currentUser.uid,
        userName: this.userProfile.name,
        notes: 0,
      })
      .then(() => {
        this.performingRequest = false;
        this.payment.description = '';
        this.payment.amount = '';
      })
      .catch(() => {
        this.performingRequest = false;
      });
  },
  bulkDelete() {
    this.performingRequest = true;
    Promise.all(
      Object.keys(this.selectedItems)
        .filter(id => this.selectedItems[id])
        .map(id => this.fb.paymentsCollection.doc(id).delete()),
    )
      .then(() => {
        this.performingRequest = false;
      })
      .catch(() => {
        this.performingRequest = false;
      });
  },
  showNewPayments() {
    const updatedPaymentsArray = this.hiddenPayments.concat(this.payments);
    // clear hiddenPayments array and update payments array
    this.$store.commit('setHiddenPayments', null);
    this.$store.commit('setPayments', updatedPaymentsArray);
  },
  openNoteModal(payment) {
    this.note.paymentId = payment.id;
    this.note.userId = payment.userId;
    this.note.paymentNotes = payment.notes;
    this.showNoteModal = true;
  },
  closeNoteModal() {
    this.note.paymentId = '';
    this.note.userId = '';
    this.note.description = '';
    this.showNoteModal = false;
  },
  addNote() {
    const paymentId = this.note.paymentId;
    const paymentNotes = this.note.paymentNotes;
    const note = {
      createdOn: new Date(),
      description: this.note.description,
      paymentId,
      userId: this.currentUser.uid,
      userName: this.userProfile.name,
    };
    this.performingRequest = true;
    this.fb.notesCollection
      .add(note)
      .then(() =>
        this.fb.paymentsCollection.doc(paymentId).update({
          notes: paymentNotes + 1,
        }),
      )
      .then(() =>
        this.fb.notesCollection
          .where('paymentId', '==', this.fullPayment.id)
          .get(),
      )
      .then((docs) => {
        const notesArray = [];
        docs.forEach((doc) => {
          const currentNote = doc.data();
          currentNote.id = doc.id;
          notesArray.push(currentNote);
        });
        this.paymentNotes = notesArray;
        this.performingRequest = false;
        this.closeNoteModal();
      })
      .catch(() => {
        this.performingRequest = false;
      });
  },
  updateDescription() {
    this.performingRequest = true;
    this.fb.paymentsCollection
      .doc(this.fullPayment.id)
      .update({
        description: this.currentDescription,
      })
      .then(() => {
        this.performingRequest = false;
      })
      .catch(() => {
        // console.log(err);
      });
  },
  search(e) {
    const word = e.target.value;
    this.$store.commit(
      'setFilteredPayments',
      this.payments.filter(
        payment =>
          payment.description.toLowerCase().includes(word.toLowerCase()) ||
            payment.userName.toLowerCase().includes(word.toLowerCase()),
      ),
    );
  },
  selectAll(e) {
    this.selectedItems = {};
    this.filteredPayments.forEach((payment) => {
      this.selectedItems[payment.id] = e.target.checked;
    });
  },
  viewPayment(payment) {
    this.performingRequest = true;
    this.fb.notesCollection
      .where('paymentId', '==', payment.id)
      .get()
      .then((docs) => {
        this.performingRequest = false;
        const notesArray = [];
        docs.forEach((doc) => {
          const note = doc.data();
          note.id = doc.id;
          notesArray.push(note);
        });
        this.paymentNotes = notesArray;
        this.currentDescription = payment.description;
        this.fullPayment = payment;
        this.showPaymentModal = true;
      })
      .catch(() => {
        // console.log(err);
      });
  },
  closePaymentModal() {
    this.paymentNotes = [];
    this.showPaymentModal = false;
  },
  applyFilter() {
    let payments = this.payments;
    Object.keys(this.selectedFilters).forEach((filter) => {
      payments = payments.filter((payment) => {
        const selectedFilterValues = Object.keys(
          this.selectedFilters[filter],
        ).filter(k => this.selectedFilters[filter][k]);
        return !selectedFilterValues.length
          ? true
          : selectedFilterValues.includes(payment[filter]);
      });
    });
    this.$store.commit('setFilteredPayments', payments);
  },
  resetFilters() {
    Object.keys(this.selectedFilters).forEach((filter) => {
      Object.keys(this.selectedFilters[filter]).forEach((k) => {
        this.selectedFilters[filter][k] = false;
      });
    });
    this.$store.commit('setFilteredPayments', this.payments);
  },
  sortBy(type) {
    this.sortState = !this.sortState;
    this.sortType = type;
    this.$store.commit(
      'setPayments',
      this.payments.sort((a, b) =>
        (this.sortState
          ? a[type]
            .toString()
            .localeCompare(b[type].toString(), 'en', { numeric: true })
          : b[type]
            .toString()
            .localeCompare(a[type].toString(), 'en', { numeric: true })),
      ),
    );
  },
};
