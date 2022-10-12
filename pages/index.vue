<script setup>
import { onBeforeMount } from 'vue';

const router = useRouter();
onBeforeMount(() => {
  router.push('/i/');
});
</script>

<template>
  <div>
    Loading...
  </div>
</template>
