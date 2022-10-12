<script setup>
import {onMounted, reactive, ref} from 'vue';
import axios from 'axios';
import ErrField from '../plugins/ErrField';

useHead({
  title: 'Create new account'
});

definePageMeta({
  // middleware: ['auth']
  layout: 'no-auth'
});

const inputUsername = ref();
onMounted(() => {
  setTimeout(() => {
    inputUsername.value.focus();
  }, 500);
});

const newAccountForm = reactive({
  username: '',
  password: '',
  passwordConfirmation: ''
});
const newAccountFormErrors = reactive({});

const router = useRouter();

const flagPasswordsMatch = ref(true);

const createNewAccount = (e) => {
  newAccountFormErrors.password = '';

  if (newAccountForm.password.length < 10)  {
    newAccountFormErrors.password = 'Password length must be greater than 10';
    return;
  }

  flagPasswordsMatch.value = true;
  if (newAccountForm.password !== newAccountForm.passwordConfirmation) {
    flagPasswordsMatch.value = false;
    return;
  }

  e.target.disabled = true;

  Object.keys(newAccountFormErrors).forEach(k => { newAccountFormErrors[k] = '' });

  const encoder = new TextEncoder().encode(newAccountForm.password);
  crypto.subtle.digest('SHA-256', encoder).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');

    const form = {
      username: newAccountForm.username,
      passwordHash: hashHex
    };

    axios.post('/api/v1/create-account', form).then((res) => {
      e.target.disabled = false;
      router.push({ path: '/login/', query: { f:'ok'} });
    }).catch((err) => {
      e.target.disabled = false;
      if (err.response && err.response.status === 400) {
        Object.keys(err.response.data).forEach(k => { newAccountFormErrors[k] = err.response.data[k]; });
      }
    });
  });
};
</script>

<template>
  <div>
    <div class="row justify-content-center">
      <div class="col col-lg-4 col-wrapper p-3">
        <h5>Create new account</h5>
        <hr>
        <form autocomplete="off">
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input ref="inputUsername" v-model.trim="newAccountForm.username" type="text" class="form-control" maxlength="50">
            <div class="text-muted">phone number, email address or some name</div>
            <err-field :message="newAccountFormErrors.username" />
          </div>
          <hr>
          <h6>Your password will be used for encrypt your another passwords. It never can't be changed in the future.</h6>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input v-model.trim="newAccountForm.password" type="text" class="form-control" maxlength="150">
            <div class="text-muted">Enter your password</div>
            <err-field :message="newAccountFormErrors.password" />
          </div>
          <div class="mb-3">
            <label class="form-label">Confirm your password</label>
            <input v-model.trim="newAccountForm.passwordConfirmation" type="text" class="form-control" maxlength="150">
            <div class="text-muted">Enter your password again</div>
            <err-field v-show="!flagPasswordsMatch" message="Passwords does not match"/>
            <err-field :message="newAccountFormErrors.passwordHash" />
          </div>
          <div class="mb-3 text-center">
            <button type="button" class="btn btn-success" @click="createNewAccount">Create account</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
