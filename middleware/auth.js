import axios from 'axios';

export default defineNuxtRouteMiddleware((to, from) => {
  const userPassword = useUserPassword();
  const cookie = useCookie('isLogged');

  if (cookie.value !== 'Y' || userPassword.value.length === 0) { //

    axios.delete('/api/v1/auth').then((res) => {
      return navigateTo('/login/');
    }).catch((err) => {
      // alert('error:' + err.response)
      return navigateTo('/login/');
    });
  }
});
