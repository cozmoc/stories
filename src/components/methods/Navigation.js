export default {
  logout() {
    this.fb.auth
      .signOut()
      .then(() => {
        this.$store.dispatch('clearData');
        this.$router.push('/login');
      })
      .catch(() => {
        // console.log(err);
      });
  },
};
