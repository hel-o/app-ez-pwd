<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import { Modal } from 'bootstrap';
import ClipboardJS from 'clipboard';

const viewDecryptedDataModal = ref();
let modal = null;
onMounted(() => {
  modal = new Modal(viewDecryptedDataModal.value, {
    // backdrop: 'static'
  });
});

const textareaDecryptedValue = ref();
const inputDecryptedValue = ref();

const refTextValue = ref('');
const flagAsTextArea = ref(false);
const showModal = (textValue, asTextArea) => {
  refTextValue.value = textValue;
  flagAsTextArea.value = asTextArea;

  setTimeout(() => {
    if (asTextArea) {
      textareaDecryptedValue.value.select();
    } else {
      inputDecryptedValue.value.select();
    }
  }, 150);

  modal.show();
};

const clipboard = new ClipboardJS('.btn-copy-decrypted', {
  text: () => {
    return refTextValue.value;
  }
});

const closeAndCopy = () => {
  modal.hide();
};

onUnmounted(() => {
  clipboard.destroy();
});

defineExpose({
  showModal
});
</script>

<template>
  <div ref="viewDecryptedDataModal" class="modal modal-lg" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">Decrypted value</h6>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form class="my-4">
            <div v-show="flagAsTextArea">
              <textarea ref="textareaDecryptedValue" rows="12" class="form-control" readonly>{{ refTextValue }}</textarea>
            </div>
            <div v-show="!flagAsTextArea">
              <input ref="inputDecryptedValue" type="text" class="form-control text-center" :value="refTextValue" readonly>
            </div>
          </form>
        </div>
        <div class="modal-footer text-center">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-success btn-copy-decrypted" @click="closeAndCopy">Close and Copy</button>
        </div>
      </div>
    </div>
  </div>
</template>
