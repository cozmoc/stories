<template>
  <div id='login'>
    <transition name='fade'>
      <div
        v-if='performingRequest'
        class='loading'
      >
        <p>Loading...</p>
      </div>
    </transition>
    <section>
      <div class='col1'>
        <h1>Stories</h1>
        <p>Welcome to <a
            href='https://www.britecore.com/'
            target='_blank'
          >Britecore</a>
          Stories transactions web app powered by Vue.js, VueX and Firebase.
          Built this project by checking out The Definitive Guide to Getting Started with Vue.js.
        </p>
        <b>
          This is my first time working on Vue.js!
        </b>
      </div>
      <div
        class='col2'
        :class="{ 'signup-form': !showLoginForm && !showForgotPassword }"
      >
        <form
          v-if='showLoginForm'
          @submit.prevent
        >
          <h1>Welcome Back</h1>

          <label for='email1'>Email</label>
          <input
            v-model.trim='loginForm.email'
            type='text'
            placeholder='you@email.com'
            id='email1'
          />

          <label for='password1'>Password</label>
          <input
            v-model.trim='loginForm.password'
            type='password'
            placeholder='******'
            id='password1'
          />

          <button
            @click='login'
            class='button'
            id='loginButton'
          >Log In</button>

          <div class='extras'>
            <a @click='togglePasswordReset'>Forgot Password</a>
            <a @click='toggleForm'>Create an Account</a>
          </div>
        </form>
        <form
          v-if='!showLoginForm && !showForgotPassword'
          @submit.prevent
        >
          <h1>Get Started</h1>

          <label for='name'>Name</label>
          <input
            v-model.trim='signupForm.name'
            type='text'
            placeholder='Ahmad Alhasan'
            id='name'
          />

          <label for='title'>Title</label>
          <input
            v-model.trim='signupForm.title'
            type='text'
            placeholder='Britecore Developer'
            id='title'
          />

          <label for='email2'>Email</label>
          <input
            v-model.trim='signupForm.email'
            type='text'
            placeholder='you@email.com'
            id='email2'
          />

          <label for='password2'>Password</label>
          <input
            v-model.trim='signupForm.password'
            type='password'
            placeholder='min 6 characters'
            id='password2'
          />

          <button
            @click='signup'
            class='button'
          >Sign Up</button>

          <div class='extras'>
            <a @click='toggleForm'>Back to Log In</a>
          </div>
        </form>
        <form
          v-if='showForgotPassword'
          @submit.prevent
          class='password-reset'
        >
          <div v-if='!passwordResetSuccess'>
            <h1>Reset Password</h1>
            <p>We will send you an email to reset your password</p>

            <label for='email3'>Email</label>
            <input
              v-model.trim='passwordForm.email'
              type='text'
              placeholder='you@email.com'
              id='email3'
            />

            <button
              @click='resetPassword'
              class='button'
            >Submit</button>

            <div class='extras'>
              <a @click='togglePasswordReset'>Back to Log In</a>
            </div>
          </div>
          <div v-else>
            <h1>Email Sent</h1>
            <p>check your email for a link to reset your password</p>
            <button
              @click='togglePasswordReset'
              class='button'
            >Back to login</button>
          </div>
        </form>
        <transition name='fade'>
          <div
            v-if="errorMsg !== ''"
            class='error-msg'
          >
            <p>{{ errorMsg }}</p>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import methods from '../methods/Login';

export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
      },
      signupForm: {
        name: '',
        title: '',
        email: '',
        password: '',
      },
      passwordForm: {
        email: '',
      },
      showLoginForm: true,
      showForgotPassword: false,
      passwordResetSuccess: false,
      performingRequest: false,
      errorMsg: '',
    };
  },
  computed: {
    ...mapState(['fb']),
  },
  methods,
};
</script>
