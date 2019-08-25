<script>
import Layout from '@layouts/auth'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'

export default {
  page: {
    title: 'Sign up',
    meta: [{ name: 'description', content: `Sign up to ${appConfig.title}` }],
  },
  components: { Layout },
  data() {
    return {
      username: '',
      password: '',
      email: '',
      authError: null,
      tryingToRegister: false,
      passwordVisible: false,
    }
  },
  computed: {
    placeholders() {
      return process.env.NODE_ENV === 'production'
        ? {}
        : {
            username: 'Username',
            password: 'Password',
          }
    },
  },
  methods: {
    ...authMethods,
    // Try to log the user in with the username
    // and password they provided.
    tryToRegister() {
      this.tryingToRegister = true
      // Reset the authError if it existed.
      this.authError = null
      return this.signUp({
        username: this.username,
        email: this.email,
        password: this.password,
      })
        .then((token) => {
          this.tryingToRegister = false

          // Redirect to the originally requested page, or to the home page
          this.$router.push(this.$route.query.redirectFrom || { name: 'home' })
        })
        .catch((error) => {
          this.tryingToRegister = false
          this.authError = error
        })
    },
  },
}
</script>

<template>
    <Layout>
    <template slot="title">
      Sign Up
    </template>
    <v-form :class="$style.form" @submit.prevent="tryToRegister">
      <v-text-field
        v-model="username"
        name="username"
        :label="placeholders.username"
        solo
      />
      <v-text-field
        v-model="email"
        label="E-mail Address"
                solo

      ></v-text-field>
      <v-text-field
        v-model="password"
        name="name"
        :label="placeholders.password"
        hint="At least 8 characters"
        min="8"
        :append-icon="passwordVisible ? 'visibility' : 'visibility_off'"
        value="Password"
        error
        solo
        :type="!passwordVisible ? 'password' : 'text'"
        @click:append="() => (passwordVisible = !passwordVisible)"
      ></v-text-field>
      <v-btn :disabled="tryingToRegister" type="submit">
        <BaseIcon v-if="tryingToRegister" name="sync" spin />
        <span v-else>
          Sign up
        </span>
      </v-btn>
      <div class="body-2 grey--text">
        Already have an account? <router-link to="/login">Login here</router-link>
      </div>
      <p v-if="authError">
        There was an error logging in to your account.
      </p>
    </v-form>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.form {
  text-align: center;
}
</style>
