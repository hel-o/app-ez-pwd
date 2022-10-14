<script setup>
import {onMounted, reactive, ref} from 'vue';
import axios from 'axios';

definePageMeta({
  // middleware: ['auth']
  layout: 'no-auth'
});

useHead({
  title: 'Login'
});

const inputUsername = ref();
onMounted(() => {
  setTimeout(() => {
    inputUsername.value.focus();
  }, 500);
});

const loginForm = reactive({
  username: '',
  password: ''
});
const loginFormErrors = reactive({});

const router = useRouter();
const route = useRoute();

const flagShowSuccessCreatedAccount = ref(false);
onMounted(()=>{
  if (route.query.f === 'ok') {
    flagShowSuccessCreatedAccount.value = true;
  }

  setTimeout(() => {
    flagShowSuccessCreatedAccount.value = false;
  }, 2000);
});

const userPassword = useUserPassword();
const doLogin = (e) => {
  e.target.disabled = true;

  Object.keys(loginFormErrors).forEach(k => { loginFormErrors[k] = '' });

  const encoder = new TextEncoder().encode(loginForm.password);
  crypto.subtle.digest('SHA-256', encoder).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');

    const form = {
      username: loginForm.username,
      passwordHash: hashHex
    };

    axios.post('/api/v1/auth', form).then((res) => {
      e.target.disabled = false;

      userPassword.value = loginForm.password;

      router.push('/i/');
    }).catch((err) => {
      e.target.disabled = false;

      if (err.response && err.response.status === 400) {
        Object.keys(err.response.data).forEach(k => { loginFormErrors[k] = err.response.data[k] });
      }
    });
  });
};

const inputPassword = ref();
const showPassword = (e)=> {
  if (inputPassword.value.type === 'text') {
    e.target.innerText = 'Show';
    inputPassword.value.type = 'password';
  } else {
    e.target.innerText = 'Hide';
    inputPassword.value.type = 'text';
  }
};

</script>

<template>
  <div>
    <div class="row justify-content-center">
      <div class="col col-lg-6 col-wrapper p-3">

        <div v-show="flagShowSuccessCreatedAccount" class="alert alert-success text-center">Your new account has been created!</div>

        <h5 class="text-center">Login</h5>
        <hr>
        <form autocomplete="off">
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input ref="inputUsername" v-model.trim="loginForm.username" type="text" class="form-control" maxlength="50">
            <err-field :message="loginFormErrors.username" />
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <div class="input-group">
              <input ref="inputPassword" v-model.trim="loginForm.password" type="password" class="form-control" maxlength="150">
              <button type="button" class="btn btn-light btn-sm" @click="showPassword" title="show password">Show</button>
            </div>
            <err-field :message="loginFormErrors.passwordHash" />
          </div>
          <div class="mb-3">
            <button type="button" class="btn btn-success form-control" @click="doLogin">Log in</button>
          </div>
          <div class="mb-3 text-end">
            <nuxt-link to="/create-account/" class="">Create account</nuxt-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
