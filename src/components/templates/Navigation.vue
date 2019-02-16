<template>
  <header>
    <section>
      <div class='col1'>
        <router-link to='dashboard'>
          <h3>Stories</h3>
        </router-link>
        <ul class='inline'>
          <li>
            <router-link to='dashboard'>Dashboard</router-link>
          </li>
          <li>
            <router-link to='settings'>Settings</router-link>
          </li>
          <li><a @click="logout">Logout</a></li>
        </ul>
      </div>
    </section>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import methods from '../methods/Navigation';

export default {
  computed: {
    ...mapState(['fb']),
  },
  methods,
};
</script>
