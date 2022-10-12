<script setup>
import { reactive, ref, onUnmounted } from 'vue';
import axios from 'axios';
import EditPwdFormModal from '../../components/pwd/EditPwdFormModal.vue';
import {decryptArrayValue} from '../../assets/js/crypto.js';
import ViewDecryptedDataModal from '../../components/pwd/ViewDecryptedDataModal.vue';

definePageMeta({
  middleware: ['auth']
});

useHead({
  title: 'Ez PWD'
})

const editPwdFormModalObj = ref();
const showEditPwdFormModal = (e, secretId) => {
  editPwdFormModalObj.value.showModal(secretId);
};

const viewDecryptedDataModalObj = ref();

const itemsCategories = reactive([]);
const listAllCategories = () => {
  axios.get('/api/v1/categories').then((res) => {
    (res.data || []).forEach(item => { itemsCategories.push(item) });
  }).catch((err) => {
    //
  });
};

const categoryIdSelected = ref(0);

const itemsUserSecrets = reactive([]);
const listUserSecrets = () => {
  itemsUserSecrets.splice(0);
  axios.get('/api/v1/user-secrets', { params: { categoryId: categoryIdSelected.value } }).then((res) => {
    (res.data || []).forEach(item => itemsUserSecrets.push(item));
  });
};

const userPassword = useUserPassword();

const decryptAndCopy = (encryptedValue, flagShowTextarea) => {
  decryptArrayValue(userPassword.value, { arrayEncrypted: encryptedValue.encrypted, arraySalt: encryptedValue.salt, arrayIv: encryptedValue.iv }, (textDecrypted) => {
    viewDecryptedDataModalObj.value.showModal(textDecrypted, flagShowTextarea);
  });
};

onMounted(() => {
  listAllCategories();
  listUserSecrets();
});

onUnmounted(() => {
  //
});

</script>

<template>
  <div>
    <div class="row justify-content-center">
      <div class="col col-wrapper p-3">
        <form>
          <div class="row mb-3">
            <div class="col">
              <select v-model="categoryIdSelected" class="form-select" @change="listUserSecrets">
                <option :value="0">-All categories-</option>
                <option v-for="item in itemsCategories" :value="item.id">{{ item.name }}</option>
              </select>
            </div>
            <!-- div class="col-2">
              <button type="button" class="btn btn-success form-control" title="Add new category">New category</button>
            </div -->
          </div>
        </form>
        <div class="mb-3 text-center">
          <a href="javascript:" @click="showEditPwdFormModal($event, 0)">Add new password</a>
        </div>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Description</th>
                <th>Username</th>
                <th>Password</th>
                <th>Note</th>
                <th>URL</th>
                <th>#</th>
              </tr>
            </thead>
            <tbody>
              <tr v-show="!itemsUserSecrets.length">
                <td colspan="6">-</td>
              </tr>
              <tr v-for="item in itemsUserSecrets">
                <td>{{ item.description || '-' }}</td>
                <td>{{ item.username || '-' }}</td>
                <td>
                  <div v-show="item.passwordEncrypted.iv.length" class="input-group">
                    <input type="password" class="form-control" value="--------------------" readonly disabled>
                    <button type="button" class="btn btn-sm btn-light"  @click="decryptAndCopy(item.passwordEncrypted, false)">View</button>
                  </div>
                  <div v-show="!item.passwordEncrypted.iv.length">--</div>
                </td>
                <td>
                  <div v-show="item.safeNoteEncrypted.iv.length" class="input-group">
                    <input type="password" class="form-control" value="--------------------" readonly disabled>
                    <button type="button" class="btn btn-sm btn-light" @click="decryptAndCopy(item.safeNoteEncrypted, true)">View</button>
                  </div>
                  <div v-show="!item.safeNoteEncrypted.iv.length">--</div>
                </td>
                <td>
                  <div v-show="item.URLSite.length">
                    <a :href="item.URLSite" target="_blank">{{ item.URLSite }}</a>
                  </div>
                  <div v-show="!item.URLSite.length">
                    -
                  </div>
                </td>
                <td>
                  <a href="javascript:" class="btn btn-success btn-sm" @click="showEditPwdFormModal($event, item.id)">Edit</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <edit-pwd-form-modal ref="editPwdFormModalObj" @on-new-user-secret="listUserSecrets"></edit-pwd-form-modal>
    <view-decrypted-data-modal ref="viewDecryptedDataModalObj" />
  </div>
</template>
