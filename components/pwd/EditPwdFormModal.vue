<script setup>
import {onMounted, reactive, ref} from 'vue';
import { Modal } from 'bootstrap';
import axios from 'axios';
import {decryptArrayValue, encryptPlainText} from '../../assets/js/crypto.js';

const userPasswordState = useUserPassword();

let modal = null;
const editPwdFormModal = ref();

onMounted(() => {
  modal = new Modal(editPwdFormModal.value, {
    backdrop: 'static'
  });
});
const emit = defineEmits(['onNewUserSecret']);

const pwdForm = reactive({
  id: 0,
  categoryId: 0,
  newCategoryName: '',
  description: '',
  username: '',
  password: '',
  safeNote: '',
  urlSite: ''
});
const pwdFormErrors = reactive({});
const flagSecretSavedSuccess = ref(false);

const flagShowNewCategory = ref(false);
const inputNewCategory = ref();

const getTheSecret = () => {
  axios.get(`/api/v1/user-secrets/${pwdForm.id}`).then((res) => {
    pwdForm.categoryId = res.data.categoryId;
    pwdForm.description = res.data.description;
    pwdForm.username = res.data.username;

    const passwordEncrypted = res.data.passwordEncrypted;
    const safeNoteEncrypted = res.data.safeNoteEncrypted;

    const decrypt1Promise = new Promise((resolve, reject) => {
      decryptArrayValue(userPasswordState.value, { arrayEncrypted: passwordEncrypted.encrypted, arraySalt: passwordEncrypted.salt, arrayIv: passwordEncrypted.iv }, (decryptedValue) => {
        resolve(decryptedValue);
      });
    });

    const decrypt2Promise = new Promise((resolve, reject) => {
      decryptArrayValue(userPasswordState.value, { arrayEncrypted: safeNoteEncrypted.encrypted, arraySalt: safeNoteEncrypted.salt, arrayIv: safeNoteEncrypted.iv }, (decryptedValue) => {
        resolve(decryptedValue);
      });
    });

    Promise.all([decrypt1Promise, decrypt2Promise]).then((values) => {
      pwdForm.password = values[0];
      pwdForm.safeNote = values[1];
    });

    pwdForm.urlSite = res.data.urlSite;
  });
};

const itemsCategories = reactive([]);
const listAllCategories = () => {
  itemsCategories.splice(0);
  axios.get('/api/v1/categories').then((res) => {
    (res.data || []).forEach(item => { itemsCategories.push(item) });
  });
};

const inputDescription = ref();
const modalTitle = ref('');
const showModal = (theSecretId) => {
  modalTitle.value = 'New secret';
  flagShowNewCategory.value = false;

  Object.keys(pwdFormErrors).forEach(k => { pwdFormErrors[k] = '';} );

  pwdForm.id = 0;
  pwdForm.categoryId = 0;
  pwdForm.newCategoryName = '';
  pwdForm.description = '';
  pwdForm.username = '';
  pwdForm.password = '';
  pwdForm.safeNote = '';
  pwdForm.urlSite = '';

  if (theSecretId) {
    modalTitle.value = 'Edit your secret';
    pwdForm.id = theSecretId;
    getTheSecret();
  }

  flagSecretSavedSuccess.value = false;

  modal.show();

  setTimeout( () => {
    inputDescription.value.focus();
  }, 150);

  listAllCategories();
};

const focusOnNewCategoryInput = () => {
  flagShowNewCategory.value = true;
  setTimeout(() => {
    inputNewCategory.value.focus()
  }, 200);
};

const saveThePwd = (e) => {
  e.target.disabled = true;

  flagSecretSavedSuccess.value = false;

  Object.keys(pwdFormErrors).forEach(k => { pwdFormErrors[k] = '';} );

  const encrypt1Promise = new Promise((resolve, reject) => {
    encryptPlainText(userPasswordState.value, pwdForm.password, (pwdEncryptedObj) => {
      resolve(pwdEncryptedObj);
    });
  });

  const encrypt2Promise = new Promise((resolve, reject) => {
    encryptPlainText(userPasswordState.value, pwdForm.safeNote, (safeNoteEncrypted) => {
      resolve(safeNoteEncrypted);
    });
  });

  Promise.all([encrypt1Promise, encrypt2Promise]).then((values) => {
    const encryptedForm = {
      id: pwdForm.id,
      categoryId: pwdForm.categoryId,
      newCategoryName: pwdForm.newCategoryName,
      description: pwdForm.description,
      username: pwdForm.username,
      passwordEncrypted: values[0],
      safeNoteEncrypted: values[1],
      urlSite: pwdForm.urlSite
    };

    let promise = null;
    if (pwdForm.id > 0) {
      promise = axios.put('/api/v1/user-secrets', encryptedForm);
    } else {
      promise = axios.post('/api/v1/user-secrets', encryptedForm);
    }

    promise.then((res) => {
      e.target.disabled = false;

      flagSecretSavedSuccess.value = true;

      if (res.status === 201) {
        pwdForm.id = res.data.id;
      }


      emit('onNewUserSecret');

      // prefer to hide the modal, prevent bug when creating new category:
      modal.hide();

    }).catch((err) => {
      e.target.disabled = false;
      if (err.response && err.response.status === 400) {
        Object.keys(err.response.data).forEach(k => { pwdFormErrors[k] = err.response.data[k]; });
      }
    });
  });
};

defineExpose({
  showModal
});

</script>

<template>
  <div ref="editPwdFormModal" class="modal modal-lg" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modalTitle }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label class="form-label required-label">Category</label>
              <div v-show="!flagShowNewCategory" class="input-group">
                <select v-model="pwdForm.categoryId" class="form-select">
                  <option :value="0">-Select category-</option>
                  <option v-for="item in itemsCategories" :value="item.id">{{ item.name }}</option>
                </select>
                <button type="button" class="btn btn-light btn-sm" @click="focusOnNewCategoryInput">New category</button>
              </div>
              <input v-show="flagShowNewCategory" v-model.trim="pwdForm.newCategoryName" ref="inputNewCategory" type="text" class="form-control">
              <err-field :message="pwdFormErrors.categoryId" />
              <err-field :message="pwdFormErrors.newCategoryName" />
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <input v-model.trim="pwdForm.description" ref="inputDescription" type="text" class="form-control" maxlength="150">
              <err-field :message="pwdFormErrors.description" />
            </div>
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input v-model.trim="pwdForm.username" type="text" class="form-control" maxlength="150">
              <err-field :message="pwdFormErrors.username" />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model.trim="pwdForm.password" type="text" class="form-control" maxlength="150">
              <div class="text-muted">Password will be encrypted</div>
              <err-field :message="pwdFormErrors.password" />
            </div>
            <div class="mb-3">
              <label class="form-label">Safe note</label>
              <textarea v-model.trim="pwdForm.safeNote" rows="12" class="form-control"></textarea>
              <div class="text-muted">Safe note will be encrypted</div>
              <err-field :message="pwdFormErrors.safeNote" />
            </div>
            <div class="mb-3">
              <label class="form-label">URL site</label>
              <input v-model.trim="pwdForm.urlSite" type="text" class="form-control" maxlength="250">
              <err-field :message="pwdFormErrors.urlSite" />
            </div>
          </form>
        </div>
        <div class="modal-footer text-center">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-success" @click="saveThePwd">Save my secret</button>
        </div>
      </div>
    </div>
  </div>
</template>
