<script setup>
import axios from 'axios';
import {onMounted, reactive, ref} from 'vue';
import {Modal} from 'bootstrap';

const emit = defineEmits(['onSecretDeleted']);

const deleteSecretConfirmationModal = ref();
let modal = null;
onMounted(() => {
  modal = new Modal(deleteSecretConfirmationModal.value, {
    backdrop: 'static'
  });
});

const secretDetails = reactive({
  id: 0,
  description: '',
  username: ''
});
const showModal = (secretId, description, username) => {
  secretDetails.id = secretId;
  secretDetails.description = description;
  secretDetails.username = username;
  modal.show();
};

const deleteTheSecret = () => {
  axios.delete(`/api/v1/user-secrets/${secretDetails.id}`).then((res) => {
    emit('onSecretDeleted');
    modal.hide();
  }).catch((err) => {
    alert(err);
  });
};

defineExpose({
  showModal
});
</script>

<template>
  <div ref="deleteSecretConfirmationModal" class="modal modal-lg" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete the secret - CONFIRMATION </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <div class="">{{ secretDetails.description }}</div>
          <hr>
          <div class="">{{ secretDetails.username }}</div>
        </div>
        <div class="modal-footer text-center">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-success" @click="deleteTheSecret">Yes, Delete it.</button>
        </div>
      </div>
    </div>
  </div>
</template>
