<template>
  <div v-show="message && message.length" class="invalid-field ps-3">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
.invalid-field {
  background-color: #f8d7da;
  color: #842029;
}
</style>
