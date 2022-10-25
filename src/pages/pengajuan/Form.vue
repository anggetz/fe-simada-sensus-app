<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="showDialog"
      persistent
      full-width
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-table
          title="Search Barang"
          :rows="dataInventaris"
          :columns="columnSearchBarang"
          row-key="id"
          v-model:pagination="pagination"
          :separator="'cell'"
          ref="tableRef"
          @update:pagination="getInventaris"
          :loading="loadingSearchBarang"
          @request="getInventaris"
          selection="multiple"
          v-model:selected="selectedInventaris"
        />
        <q-card-actions align="right">
          <q-btn label="Submit" color="green" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      ref="formPengajuan"
      class="q-gutter-md"
    >
      <div class="row">
        <div class="col-4 q-px-xs">
          <q-select
            outlined
            v-model="form.cabang_dinas_id"
            :options="optionsCabangDinas"
            map-options
            emit-value
            label="Kuasa Pengguna Barang"
            option-value="id"
            option-label="text"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Mohon pilih cabang dinas',
            ]"
          />
        </div>
        <div class="col-4 q-px-xs">
          <q-select
            outlined
            v-model="form.sekolah_id"
            :options="optionsSekolah"
            map-options
            emit-value
            label="Sub Kuasa Pengguna Barang"
            option-value="id"
            option-label="text"
            :rules="[
              (val) => (val !== null && val !== '') || 'Mohon pilih sekolah',
            ]"
          />
        </div>
        <div class="col-4 q-px-xs">
          <q-input
            outlined
            v-model="form.tanggal_usulan"
            mask="date"
            label="Tanggal Usulan"
            :rules="[
              'date',
              (val) =>
                (val !== null && val !== '') || 'Mohon isi tanggal usulan',
            ]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="form.tanggal_usulan" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row">
        <div class="col-3 q-px-xs">
          <q-input
            v-model="form.no_surat_usulan"
            label="No Surat Usulan"
            outlined
          />
        </div>
        <div class="col-3 q-px-xs">
          <q-input
            outlined
            v-model="form.tgl_surat_usulan"
            mask="date"
            label="Tanggal Surat Usulan"
            :rules="[
              'date',
              (val) =>
                (val !== null && val !== '') || 'Mohon isi tanggal usulan',
            ]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="form.tgl_surat_usulan" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-3 q-px-xs">
          <q-input
            v-model="form.no_surat_pernyataan"
            label="No Surat Pernyataan"
            outlined
          />
        </div>
        <div class="col-3 q-px-xs">
          <q-input
            outlined
            v-model="form.tgl_surat_pernyataan"
            mask="date"
            label="Tanggal Surat Usulan"
            :rules="[
              'date',
              (val) =>
                (val !== null && val !== '') || 'Mohon isi tanggal usulan',
            ]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="form.tgl_surat_pernyataan" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row">
        <div class="col-6 q-px-xs">
          <q-uploader
            :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
            :headers="[
              { name: 'Authorization', value: 'Bearer ' + token },
              { name: 'Accept-Type', value: 'application/json' },
            ]"
            ref="usulanUploader"
            label="Surat Usulan"
            @uploaded="uploadedUsulan"
            @removed="(info: any) => {removedUsulan(info, '1')}"
            @change="changeUsulan"
            :auto-upload="true"
            style="width: 100%"
            multiple
          >
            <template v-slot:header="scope">
              <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                <q-btn
                  v-if="scope.queuedFiles.length > 0"
                  icon="clear_all"
                  @click="scope.removeQueuedFiles"
                  round
                  dense
                  flat
                >
                  <q-tooltip>Clear All</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="scope.uploadedFiles.length > 0"
                  icon="done_all"
                  @click="scope.removeUploadedFiles"
                  round
                  dense
                  flat
                >
                  <q-tooltip>Remove Uploaded Files</q-tooltip>
                </q-btn>
                <q-spinner
                  v-if="scope.isUploading"
                  class="q-uploader__spinner"
                />
                <div class="col">
                  <div class="q-uploader__title">Surat Usulan</div>
                  <div class="q-uploader__subtitle">
                    {{ scope.uploadSizeLabel }} /
                    {{ scope.uploadProgressLabel }}
                  </div>
                </div>
                <q-btn
                  v-if="scope.canAddFiles"
                  type="a"
                  icon="add_box"
                  @click="scope.pickFiles"
                  round
                  dense
                  flat
                >
                  <q-uploader-add-trigger />
                  <q-tooltip>Pick Files</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="scope.canUpload"
                  icon="cloud_upload"
                  @click="scope.upload"
                  round
                  dense
                  flat
                >
                  <q-tooltip>Upload Files</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="scope.isUploading"
                  icon="clear"
                  @click="scope.abort"
                  round
                  dense
                  flat
                >
                  <q-tooltip>Abort Upload</q-tooltip>
                </q-btn>
              </div>
            </template>
          </q-uploader>
        </div>
        <div class="col-6 q-px-xs">
          <q-uploader
            :url="apiUrl + '/api/v1/pembongkaran/upload/surat-pernyataan'"
            :headers="[
              { name: 'Authorization', value: 'Bearer ' + token },
              { name: 'Accept-Type', value: 'application/json' },
            ]"
            label="Surat Pernyataan"
            :auto-upload="true"
            @uploaded="uploadedPernyataan"
            @removed="removedPernyataan"
            style="width: 100%"
            multiple
          >
            <template v-slot:header="scope">
              <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                <q-btn
                  v-if="scope.queuedFiles.length > 0"
                  icon="clear_all"
                  @click="scope.removeQueuedFiles"
                  round
                  dense
                  flat
                >
                  <q-tooltip>Clear All</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="scope.uploadedFiles.length > 0"
                  icon="done_all"
                  @click="scope.removeUploadedFiles"
                  round
                  dense
                  flat
                >
                  <q-tooltip>Remove Uploaded Files</q-tooltip>
                </q-btn>
                <q-spinner
                  v-if="scope.isUploading"
                  class="q-uploader__spinner"
                />
                <div class="col">
                  <div class="q-uploader__title">Surat Pernyataan</div>
                  <div class="q-uploader__subtitle">
                    {{ scope.uploadSizeLabel }} /
                    {{ scope.uploadProgressLabel }}
                  </div>
                </div>
                <q-btn
                  v-if="scope.canAddFiles"
                  type="a"
                  icon="add_box"
                  @click="scope.pickFiles"
                  round
                  dense
                  flat
                >
                  <q-uploader-add-trigger />
                  <q-tooltip>Pick Files</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="scope.canUpload"
                  icon="cloud_upload"
                  @click="scope.upload"
                  round
                  dense
                  flat
                >
                  <q-tooltip>Upload Files</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="scope.isUploading"
                  icon="clear"
                  @click="scope.abort"
                  round
                  dense
                  flat
                >
                  <q-tooltip>Abort Upload</q-tooltip>
                </q-btn>
              </div>
            </template>
          </q-uploader>
        </div>
      </div>
      <div class="row q-pt-md">
        <div class="col-4 q-px-xs">
          <q-input
            outlined
            v-model="searchBarang"
            :readonly="true"
            label="Label"
          >
            <template v-slot:prepend>
              <q-icon name="search" @click="triggerShowBarang()"> </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-4 q-px-xs">
          <q-select
            outlined
            v-model="form.jenis"
            :options="optionsFeature"
            map-options
            emit-value
            label="Jenis Pembongkaran"
            option-value="code"
            option-label="name"
          />
        </div>
      </div>
      <div class="row q-pt-md">
        <div class="col-12">
          <q-table
            title="Aset"
            :rows="selectedInventaris"
            :columns="columnSearchBarang"
            row-key="id"
            :separator="'cell'"
            ref="tableRefNonPagination"
          >
            <template v-slot:body-cell-upload_media="props">
              <q-td key="name" :props="props">
                <q-uploader
                  :url="apiUrl + '/api/v1/pembongkaran/upload/media'"
                  :headers="[
                    { name: 'Authorization', value: 'Bearer ' + token },
                    { name: 'Accept-Type', value: 'application/json' },
                  ]"
                  label="Media"
                  :auto-upload="true"
                  @uploaded="
                    (info) => {
                      uploadedMedia(info, props.rowIndex);
                    }
                  "
                  @removed="
                    (info) => {
                      removedMedia(info, props.rowIndex);
                    }
                  "
                  style="width: 100%"
                  multiple
                >
                  <template v-slot:header="scope">
                    <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                      <q-btn
                        v-if="scope.queuedFiles.length > 0"
                        icon="clear_all"
                        @click="scope.removeQueuedFiles"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>Clear All</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="scope.uploadedFiles.length > 0"
                        icon="done_all"
                        @click="scope.removeUploadedFiles"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>Remove Uploaded Files</q-tooltip>
                      </q-btn>
                      <q-spinner
                        v-if="scope.isUploading"
                        class="q-uploader__spinner"
                      />
                      <div class="col">
                        <div class="q-uploader__title"></div>
                        <div class="q-uploader__subtitle">
                          {{ scope.uploadSizeLabel }} /
                          {{ scope.uploadProgressLabel }}
                        </div>
                      </div>
                      <q-btn
                        v-if="scope.canAddFiles"
                        type="a"
                        icon="add_box"
                        @click="scope.pickFiles"
                        round
                        dense
                        flat
                      >
                        <q-uploader-add-trigger />
                        <q-tooltip>Pick Files</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="scope.canUpload"
                        icon="cloud_upload"
                        @click="scope.upload"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>Upload Files</q-tooltip>
                      </q-btn>

                      <q-btn
                        v-if="scope.isUploading"
                        icon="clear"
                        @click="scope.abort"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>Abort Upload</q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                </q-uploader>
              </q-td>
            </template>
            <template v-slot:body-cell-upload_file="props">
              <q-td key="name" :props="props">
                <q-uploader
                  :url="apiUrl + '/api/v1/pembongkaran/upload/file'"
                  :headers="[
                    { name: 'Authorization', value: 'Bearer ' + token },
                    { name: 'Accept-Type', value: 'application/json' },
                  ]"
                  label="File"
                  :auto-upload="true"
                  @uploaded="
                    (info) => {
                      uploadedFile(info, props.rowIndex);
                    }
                  "
                  @removed="
                    (info) => {
                      removedFile(info, props.rowIndex);
                    }
                  "
                  style="width: 100%"
                  multiple
                >
                  <template v-slot:header="scope">
                    <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                      <q-btn
                        v-if="scope.queuedFiles.length > 0"
                        icon="clear_all"
                        @click="scope.removeQueuedFiles"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>Clear All</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="scope.uploadedFiles.length > 0"
                        icon="done_all"
                        @click="scope.removeUploadedFiles"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>Remove Uploaded Files</q-tooltip>
                      </q-btn>
                      <q-spinner
                        v-if="scope.isUploading"
                        class="q-uploader__spinner"
                      />
                      <div class="col">
                        <div class="q-uploader__title"></div>
                        <div class="q-uploader__subtitle">
                          {{ scope.uploadSizeLabel }} /
                          {{ scope.uploadProgressLabel }}
                        </div>
                      </div>
                      <q-btn
                        v-if="scope.canAddFiles"
                        type="a"
                        icon="add_box"
                        @click="scope.pickFiles"
                        round
                        dense
                        flat
                      >
                        <q-uploader-add-trigger />
                        <q-tooltip>Pick Files</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="scope.canUpload"
                        icon="cloud_upload"
                        @click="scope.upload"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>Upload Files</q-tooltip>
                      </q-btn>

                      <q-btn
                        v-if="scope.isUploading"
                        icon="clear"
                        @click="scope.abort"
                        round
                        dense
                        flat
                      >
                        <q-tooltip>Abort Upload</q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                </q-uploader>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
      <div class="row q-pt-md" align="right">
        <q-btn label="Submit" type="submit" color="green" class="q-pr-md" />
        <q-btn
          label="Reset"
          type="reset"
          color="green"
          class="q-pl-md q-ml-xs"
        />
      </div>
    </q-form>
  </div>
</template>
<script lang="ts">
import { UploadModel } from 'components/models/common';
import { PembongkaranModel } from 'components/models/pembongkaran';
import { useQuasar } from 'quasar';
import { defineComponent, ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'FormPage',
  setup() {
    const $q = useQuasar();
    const store = useStore();
    const optionsCabangDinas = ref([]);
    const optionsSekolah = ref([]);
    const optionsFeature = ref([]);
    const dataInventaris = ref([]);
    const loadingSearchBarang = ref(false);
    const selectedInventaris = ref([]);
    const apiUrl = process.env.API_URL;
    const mediaCurrentIndex = 0;
    const tableRef = ref();
    const columnSearchBarang = [
      {
        name: 'kode_barang',
        label: 'Kode Barang',
        field: 'kode_barang',
      },
      {
        name: 'barang',
        label: 'Nama Barang',
        field: 'nama_rek_aset',
      },
      {
        name: 'tahun_perolehan',
        label: 'Tahun Perolehan',
        field: 'tahun_perolehan',
      },
      {
        name: 'upload_media',
        label: 'Upload Media',
        field: 'upload_media',
      },
      {
        name: 'upload_file',
        label: 'Upload File',
        field: 'upload_file',
      },
    ];
    const pagination = reactive({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
      // rowsNumber: xx if getting data from a server
    });

    const paginationSelected = reactive({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
      // rowsNumber: xx if getting data from a server
    });
    const searchBarang = ref('');
    const showDialog = ref(false);
    const form = reactive<PembongkaranModel>({
      cabang_dinas_id: undefined,
      sekolah_id: undefined,
      asets: [],
      m_barang_id: 0,
      tanggal_usulan: '',
      upload_surat_usulan: [],
      upload_surat_pernyataan: [],
      jenis: 0,
    });

    const token = computed({
      get: () => store.state.auth.token,
      set: (val: any) => {
        store.commit('auth/setCode', val);
      },
    });

    return {
      mediaCurrentIndex,
      optionsCabangDinas,
      optionsSekolah,
      optionsFeature,
      dataInventaris,
      loadingSearchBarang,
      columnSearchBarang,
      selectedInventaris,
      paginationSelected,
      tableRef,
      apiUrl,
      token,
      searchBarang,
      pagination,
      showDialog,
      form,
      $q,
    };
  },
  async mounted() {
    await this.getCabangDinas();
    await this.getSekolah();
    await this.getFeature();
  },
  methods: {
    onSubmit() {
      const self = this;
      this.$q.loading.show({
        message: 'Submitting, please wait...',
      });
      this.$refs.formPengajuan.validate().then((success) => {
        if (success) {
          this.form.asets = this.selectedInventaris;
          this.$api
            .post('api/v1/pembongkaran/core/store', this.form)
            .then((response: any) => {
              this.$q.notify({
                message: 'Data has been saved.',
                color: 'green',
              });
              this.$q.loading.hide();
              this.$router.push('/pengajuan');
            })
            .catch(function (err: any) {
              if (err.response.status == 422) {
                // validation error
                self.$q.notify({
                  message: err.response.data.message,
                  color: 'red',
                });
              }
              self.$q.loading.hide();
            });
        }
      });
    },
    onReset() {
      this.form = {
        cabang_dinas_id: undefined,
        sekolah_id: undefined,
        asets: [],
        m_barang_id: 0,
        tanggal_usulan: '',
        upload_surat_usulan: [],
        upload_surat_pernyataan: [],
        jenis: 0,
      };
    },
    removedUsulan(info: any, test: any) {
      console.log(this, info, test);
      const indexMustBeDelete = this.form.upload_surat_usulan.findIndex((d) => {
        return d.__key == info[0].__key;
      });
      this.form.upload_surat_usulan.splice(indexMustBeDelete, 1);
    },
    uploadedMedia(info: any, index: number) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.origin = info.files[0];
      if (!this.selectedInventaris[index].upload_media) {
        this.selectedInventaris[index].upload_media = [] as UploadModel;
      }
      this.selectedInventaris[index].upload_media.push(infoUploadedFile);
    },
    removedMedia(info: any, index: number) {
      const indexMustBeDelete = this.selectedInventaris[
        index
      ].upload_media.findIndex((d) => {
        return d.__key == info[0].__key;
      });
      this.selectedInventaris[index].upload_media.splice(indexMustBeDelete, 1);
    },
    uploadedFile(info: any, index: number) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.origin = info.files[0];
      if (!this.selectedInventaris[index].upload_file) {
        this.selectedInventaris[index].upload_file = [] as UploadModel;
      }
      this.selectedInventaris[index].upload_file.push(infoUploadedFile);
    },
    removedFile(info: any, index: number) {
      const indexMustBeDelete = this.selectedInventaris[
        index
      ].upload_file.findIndex((d) => {
        return d.__key == info[0].__key;
      });
      this.selectedInventaris[index].upload_file.splice(indexMustBeDelete, 1);
    },
    uploadedUsulan(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      this.form.upload_surat_usulan.push(infoUploadedFile);
    },
    removedPernyataan(info: any) {
      const indexMustBeDelete = this.form.upload_surat_pernyataan.findIndex(
        (d) => {
          return d.__key == info[0].__key;
        }
      );
      this.form.upload_surat_pernyataan.splice(indexMustBeDelete, 1);
    },
    uploadedPernyataan(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      this.form.upload_surat_pernyataan.push(infoUploadedFile);
    },
    triggerShowBarang() {
      this.showDialog = !this.showDialog;
      if (!this.showDialog) {
        console.log(this.tableRef);
        setTimeout(() => {
          this.tableRef.value.requestServerInteraction();
        }, 500);
      }
    },
    async getFeature() {
      this.$api
        .get('api/v1/pembongkaran/master/feature')
        .then((response: any) => {
          let data = { response };
          this.optionsFeature = data.response.data;
        });
    },
    async getInventaris(props: any) {
      console.log(props.pagination, 'test');
      this.loadingSearchBarang = true;

      if (props.pagination) {
        const { page, rowsPerPage, sortBy, descending } = props.pagination;
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;
      }

      this.$api
        .get(
          `api/v1/pembongkaran/inventaris/get?start=${
            (this.pagination.page - 1) * this.pagination.rowsPerPage
          }&length=${this.pagination.rowsPerPage}`
        )
        .then((response: any) => {
          let data = { response };
          this.dataInventaris = data.response.data.data;
          this.pagination.rowsNumber = data.response.data.recordsTotal;

          this.loadingSearchBarang = false;
        });
    },
    async getCabangDinas() {
      this.$api
        .get('api/v1/pembongkaran/master/get-organisasi?level=1')
        .then((response: any) => {
          let data = { response };
          this.optionsCabangDinas = data.response.data.data;
        });
    },
    async getSekolah() {
      this.$api
        .get('api/v1/pembongkaran/master/get-organisasi?level=2')
        .then((response: any) => {
          let data = { response };
          this.optionsSekolah = data.response.data.data;
        });
    },
  },
});
</script>
