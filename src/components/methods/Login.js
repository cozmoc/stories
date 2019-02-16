export default {
  toggleForm() {
    this.errorMsg = '';
    this.showLoginForm = !this.showLoginForm;
  },
  togglePasswordReset() {
    if (this.showForgotPassword) {
      this.showLoginForm = true;
      this.showForgotPassword = false;
      this.passwordResetSuccess = false;
    } else {
      this.showLoginForm = false;
      this.showForgotPassword = true;
    }
  },
  login() {
    this.performingRequest = true;
    this.fb.auth
      .signInWithEmailAndPassword(
        this.loginForm.email,
        this.loginForm.password,
      )
      .then((res) => {
        const user = res.user;
        this.$store.commit('setCurrentUser', user);
        this.$store.dispatch('fetchUserProfile');
        this.performingRequest = false;
        this.$router.push('/dashboard');
      })
      .catch((err) => {
        // console.log(err);
        this.performingRequest = false;
        this.errorMsg = err.message;
      });
  },
  signup() {
    this.performingRequest = true;
    this.fb.auth
      .createUserWithEmailAndPassword(
        this.signupForm.email,
        this.signupForm.password,
      )
      .then((res) => {
        const user = res.user;
        this.$store.commit('setCurrentUser', user);
        // create user obj
        this.fb.usersCollection
          .doc(user.uid)
          .set({
            name: this.signupForm.name,
            title: this.signupForm.title,
          })
          .then(() => {
            this.$store.dispatch('fetchUserProfile');
            this.performingRequest = false;
            this.$router.push('/dashboard');
          })
          .catch((err) => {
            // console.log(err);
            this.performingRequest = false;
            this.errorMsg = err.message;
          });
      })
      .catch((err) => {
        // console.log(err);
        this.performingRequest = false;
        this.errorMsg = err.message;
      });
  },
  resetPassword() {
    this.performingRequest = true;
    this.fb.auth
      .sendPasswordResetEmail(this.passwordForm.email)
      .then(() => {
        this.performingRequest = false;
        this.passwordResetSuccess = true;
        this.passwordForm.email = '';
      })
      .catch((err) => {
        // console.log(err);
        this.performingRequest = false;
        this.errorMsg = err.message;
      });
  },
};
