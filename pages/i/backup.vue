<script setup>
definePageMeta({
  middleware: ['auth']
});

useHead({
  title: 'Download backup'
});
</script>

<template>
  <div>
    <div class="row justify-content-center">
      <div class="col col-lg-4 col-wrapper p-3">
        <h5>Download backup</h5>
        <hr>
        <div class="text-center my-5">
          <a href="/api/v1/user-secrets/backup">Click here to Download the backup</a>
        </div>
      </div>
    </div>
  </div>
</template>
