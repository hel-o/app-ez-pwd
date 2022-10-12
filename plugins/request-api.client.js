import axios from 'axios';
import {navigateTo} from 'nuxt/app';
import ErrField from '~/plugins/ErrField';

export default defineNuxtPlugin((nuxtApp) => {

  // https://v3.nuxtjs.org/api/composables/use-nuxt-app/#vueapp
  nuxtApp.vueApp.component('ErrField', ErrField);

  axios.interceptors.response.use((response) => {
    return response;
  }, (err) => {
    if (err.response && err.response.status === 403) {
      axios.delete('/api/v1/auth').then((res) => {
        navigateTo('/login/');
      });
    } else if (err.response && err.response.status === 401) {
      navigateTo('/login/');
    }
    return Promise.reject(err);
  });
});
