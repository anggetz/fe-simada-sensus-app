<template>
  <div class="q-ma-lg" v-if="user !== undefined">
    <q-dialog v-model="timelineDetail" full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">Status History</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-timeline color="secondary">
            <q-timeline-entry
              v-for="(status, index) in statusHistory"
              :title="status.workflow.alias_status_name"
              v-bind:key="index"
              :subtitle="status.created_at"
            >
              <div></div>
            </q-timeline-entry>
          </q-timeline>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="uploadBeritaAcaraDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Upload Berita Acara</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col-6 q-px-xs">
              <q-input
                v-model="form.no_surat_berita_acara"
                label="No Surat Berita Acara"
                outlined
              />
            </div>
            <div class="col-6 q-px-xs">
              <q-input
                outlined
                v-model="form.tgl_surat_berita_acara"
                mask="date"
                label="Tanggal Surat Berita Acara"
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
                      <q-date
                        v-model="form.tgl_surat_berita_acara"
                        mask="YYYY-MM-DD"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col-12 q-mt-xs">
              <q-uploader
                :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
                :headers="[
                  { name: 'Authorization', value: 'Bearer ' + token },
                  { name: 'Accept-Type', value: 'application/json' },
                ]"
                ref="usulanUploader"
                label="Berita Acara"
                @uploaded="uploadedBeritaAcara"
                @removed="removedBeritaAcara"
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
                      <div class="q-uploader__title">Berita Acara</div>
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

          <div class="row q-mt-md" v-if="laporan != undefined">
            <div class="col-6 q-px-xs">
              <q-input
                v-model="form.no_surat_laporan"
                label="No Laporan"
                outlined
              />
            </div>
            <div class="col-6 q-px-xs">
              <q-input
                outlined
                v-model="form.tgl_surat_laporan"
                mask="date"
                label="Tanggal Laporan"
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
                      <q-date
                        v-model="form.tgl_surat_laporan"
                        mask="YYYY-MM-DD"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row" v-if="laporan != undefined">
            <div class="col-12 q-mt-md">
              <q-uploader
                :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
                :headers="[
                  { name: 'Authorization', value: 'Bearer ' + token },
                  { name: 'Accept-Type', value: 'application/json' },
                ]"
                ref="usulanUploader"
                label="Berita Acara"
                @uploaded="uploadedLaporan"
                @removed="removedLaporan"
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
                      <div class="q-uploader__title">Dokumen Laporan</div>
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
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="SaveBeritaAcara" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row">
      <div class="col-6 q-pb-md">
        <q-select
          outlined
          v-model="filter.feature"
          :options="optionsFeature"
          map-options
          emit-value
          clearable
          label="Jenis Pembongkaran"
          option-value="code"
          option-label="name"
        />
      </div>
      <div class="col-6 q-pb-md">
        <!-- <div class="float-right q-pt-md">
          <q-btn
            color="green"
            v-if="user.organisasi.level == 0"
            @click="goToPengajuan()"
          >
            Tambah Pengajuan
          </q-btn>
        </div> -->
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <q-table
          title=""
          :rows="dataPembongkaran"
          :columns="columnGridPembongkaran"
          row-key="id"
          v-model:pagination="pagination"
          :separator="'cell'"
          ref="tableRef"
          :loading="loadingGridPembongkaran"
          @request="getDataPembongkaran"
        >
          <template v-slot:body-cell-cabang_dinas="props">
            <q-td key="name" :props="props">
              {{ props.row.cabang_dinas.nama }}
            </q-td>
          </template>
          <template v-slot:body-cell-sekolah="props">
            <q-td key="name" :props="props">
              {{ props.row.sekolah.nama }}
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td key="name" :props="props">
              {{ getStatus(props) }}
            </q-td>
          </template>
          <template v-slot:body-cell-status_doc="props">
            <q-td key="name" :props="props">
              {{ props.row.statuses.workflow ? getStatusDoc(props) : '-' }}
            </q-td>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td key="name" :props="props">
              <q-btn
                v-if="
                  props.row.statuses.workflow.name == 'Revisi Pengajuan' &&
                  user.organisasi.level == 0
                "
                @click="reviseThis(props.row.id)"
              >
                Revisi
              </q-btn>
              <q-btn
                v-if="
                  (props.row.statuses.workflow.group_flow === 'first' ||
                    props.row.statuses.workflow.group_flow === 'third' ||
                    props.row.statuses.workflow.group_flow == 'second') &&
                  props.row.status != 'S' &&
                  user.organisasi.level <= -1 &&
                  props.row.statuses.workflow.name !== 'Revisi Pengajuan'
                "
                color="secondary"
                label="Proses"
                align="center"
                @click="goToProses(props.row.id)"
              />
              <template
                v-if="
                  (props.row.statuses.workflow.name === 'upload_berita_acara' ||
                    props.row.statuses.workflow.name === 'upload_laporan') &&
                  user.organisasi.level == 0 &&
                  props.row.status == 'S'
                "
              >
                <q-btn
                  color="secondary"
                  align="center"
                  @click="openModalBeritaAcara(props.row.id)"
                  class="q-ml-xs"
                >
                  Upload Berita Acara
                </q-btn>
              </template>
              <q-btn
                color="info"
                class="q-ml-xs"
                @click="openModalTimeline(props.row.id)"
              >
                <q-icon name="history" />
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { UploadModel } from 'src/components/models/common';
import { PembongkaranModel } from 'src/components/models/pembongkaran';
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';

export interface filterIndex {
  feature: number;
}

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const $q = useQuasar();
    const statusHistory = ref([]);
    const dataPembongkaran = ref([]);
    const optionsFeature = ref([]);
    const timelineDetail = ref(false);
    const filter = ref<filterIndex>({
      feature: 0,
    });
    const store = useStore();
    const form = ref<PembongkaranModel>({});
    const uploadBeritaAcaraDialog = ref(false);
    const tableRef = ref();
    const apiUrl = process.env.API_URL;
    const token = computed({
      get: () => store.state.auth.token,
      set: (val: any) => {
        store.commit('auth/setCode', val);
      },
    });

    const user = computed({
      get: () => store.state.auth.info,
      set: (val: any) => {
        store.commit('auth/setInfo', val);
      },
    });

    const laporan = computed({
      get: () => {
        return form.value.feature
          ? form.value.feature.workflows.find((d) => {
              console.log('test');
              return d.name == 'upload_laporan';
            })
          : undefined;
      },
      set: (val: any) => {
        // do nothing
      },
    });
    const loadingGridPembongkaran = ref(false);
    const columnGridPembongkaran = [
      {
        name: 'tanggal_usulan',
        label: 'Tanggal Usulan',
        field: 'tanggal_usulan',
      },
      {
        name: 'cabang_dinas',
        label: 'Cabang Dinas',
        field: 'cabang_dinas_id',
      },
      {
        name: 'sekolah',
        label: 'Sekolah',
        field: 'sekolah_id',
      },
      {
        name: 'status',
        label: 'Status',
        field: 'status',
      },
      {
        name: 'status_doc',
        label: 'Status Dokumen',
        field: 'status_doc',
      },
      {
        name: 'action',
        label: '',
        field: 'action',
      },
    ];

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
      // rowsNumber: xx if getting data from a server
    });

    return {
      $q,
      apiUrl,
      user,
      statusHistory,
      timelineDetail,
      token,
      form,
      laporan,
      uploadBeritaAcaraDialog,
      dataPembongkaran,
      columnGridPembongkaran,
      loadingGridPembongkaran,
      pagination,
      optionsFeature,
      filter,
      tableRef,
    };
  },
  async mounted() {
    await this.getFeature();
    setTimeout(() => {
      this.$refs.tableRef.requestServerInteraction();
      // this.tableRef.value.requestServerInteraction();
    }, 500);
  },
  watch: {
    filter: {
      handler(newFilter, oldFilter) {
        this.$refs.tableRef.requestServerInteraction();
      },
      deep: true,
    },
  },
  methods: {
    reviseThis(id: any) {
      this.$router.push({
        name: 'revise',
        params: {
          id: id,
          action: 'revise',
        },
      });
    },
    getStatus(props: any) {
      if (props.row.statuses.workflow.name == 'complete') {
        return '-';
      }

      if (props.row.status == 'S') {
        return 'Telah disahkan';
      } else if (props.row.status == 'P') {
        return 'Menunggu persetujuan';
      } else if (props.row.status == 'D') {
        return 'Menunggu persetujuan';
      }
    },
    getStatusDoc(props: any) {
      if (
        props.row.statuses.workflow.name == 'complete' ||
        props.row.statuses.workflow.name == 'Revisi Pengajuan'
      ) {
        return props.row.statuses.workflow.alias_status_name;
      } else {
        return props.row.feature
          ? props.row.feature.workflows.find((d) => {
              return d.step_order == props.row.statuses.workflow.step_order - 1;
            })?.alias_status_name
          : undefined;
      }
    },
    SaveBeritaAcara() {
      this.$q.loading.show({
        message: 'Upadating data... please wait',
      });
      this.$api
        .post(`api/v1/pembongkaran/core/update-status/${this.form.id}`, {
          data: this.form,
          status_data: {
            pembongkaran_id: this.form.id,
            feature_workflow_code: this.form.feature.workflows.find((d) => {
              return (
                d.step_order == this.form.statuses.workflow.step_order + 1 &&
                !d.is_revise_status
              );
            }).workflow_code,
          },
        })
        .then((response: any) => {
          this.$q.notify({
            message: 'Data updated.',
            color: 'green',
          });
          this.uploadBeritaAcaraDialog = false;
          this.$refs.tableRef.requestServerInteraction();
          this.$q.loading.hide();
        })
        .catch((response: any) => {
          this.$q.notify({
            message: 'Failed update data.',
            color: 'red',
          });
          this.uploadBeritaAcaraDialog = false;
          this.$refs.tableRef.requestServerInteraction();
          this.$q.loading.hide();
        });
    },
    removedLaporan(info: any) {
      console.log(this, info);
      const indexMustBeDelete = this.form.upload_laporan.findIndex((d) => {
        return d.__key == info[0].__key;
      });
      this.form.upload_laporan.splice(indexMustBeDelete, 1);
    },
    uploadedLaporan(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.origin = info.files[0];
      if (!this.form.upload_laporan) {
        this.form.upload_laporan = [] as UploadModel;
      }
      this.form.upload_laporan.push(infoUploadedFile);
    },
    removedBeritaAcara(info: any) {
      console.log(this, info, test);
      const indexMustBeDelete = this.form.upload_berita_acara.findIndex((d) => {
        return d.__key == info[0].__key;
      });
      this.form.upload_berita_acara.splice(indexMustBeDelete, 1);
    },
    uploadedBeritaAcara(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.origin = info.files[0];
      if (!this.form.upload_berita_acara) {
        this.form.upload_berita_acara = [] as UploadModel;
      }
      this.form.upload_berita_acara.push(infoUploadedFile);
    },
    goToPengajuan() {
      this.$router.push('/pengajuan/form/create');
    },
    goToProses(id: number) {
      this.$router.push({
        name: 'validation',
        params: {
          id: id,
        },
      });
    },
    async openModalTimeline(id: any) {
      await this.getDataPembongkaranById(id, true);

      this.timelineDetail = true;
    },
    async openModalBeritaAcara(id: any) {
      await this.getDataPembongkaranById(id, false);
      this.uploadBeritaAcaraDialog = true;
    },
    async getDataPembongkaranById(id: any, isNeedHistory: boolean) {
      let url = `api/v1/pembongkaran/core/one/${id}`;
      if (isNeedHistory) {
        url = `api/v1/pembongkaran/core/one/${id}?need_history=1`;
      }

      this.$api.get(url).then((response: any) => {
        let data = { response };
        this.form = data.response.data as PembongkaranModel;
        this.statusHistory = data.response.data.status_history.sort((a, b) => {
          if (a.created_at < b.created_at) {
            return -1;
          }

          if (a.created_at > b.created_at) {
            return 1;
          }

          return 0;
        });
      });
    },
    async getFeature() {
      this.$api
        .get('api/v1/pembongkaran/master/feature')
        .then((response: any) => {
          let data = { response };
          this.optionsFeature = data.response.data;
        });
    },
    async getDataPembongkaran(props: any) {
      this.loadingGridPembongkaran = true;

      if (props.pagination) {
        const { page, rowsPerPage, sortBy, descending } = props.pagination;
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;
      }

      this.$api
        .get(
          `api/v1/pembongkaran/core/get?start=${
            (this.pagination.page - 1) * this.pagination.rowsPerPage
          }&length=${this.pagination.rowsPerPage}&filterFeature=${
            this.filter.feature
          }`
        )
        .then((response: any) => {
          let data = { response };
          this.dataPembongkaran = data.response.data.data;
          this.pagination.rowsNumber = data.response.data.recordsTotal;
          console.log(data.response.data.recordsTotal);

          this.loadingGridPembongkaran = false;
        });
    },
  },
});
</script>
