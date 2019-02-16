export default {
  updateProfile() {
    this.$store.dispatch('updateProfile', {
      name: this.name !== '' ? this.name : this.userProfile.name,
      title: this.title !== '' ? this.title : this.userProfile.title,
    });
    this.name = '';
    this.title = '';
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 2000);
  },
};
