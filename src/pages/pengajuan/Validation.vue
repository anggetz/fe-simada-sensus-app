<template>
  <div class="q-ma-lg" v-if="existingData.feature !== undefined">
    <q-form @submit="() => {}" ref="formValidasi" class="q-gutter-md">
      <div class="row">
        <div class="col-6">
          <q-btn
            @click="downloadSuratUsulan"
            color="primary"
            label="Lihat Surat Usulan"
            style="width: 250px"
          >
            <q-icon name="download" class="cursor-pointer" />
          </q-btn>
          <q-toggle
            v-model="form.is_surat_usulan_sesuai"
            @update:model-value="
              (value:any) => insertTheRevision('surat_usulan', value, 'is_ok')
            "
            label=""
          />
          {{ form.is_surat_usulan_sesuai ? 'Sesuai' : 'Tidak Sesuai' }}
        </div>
        <div class="col-6" v-if="!form.is_surat_usulan_sesuai">
          <q-input
            type="textarea"
            v-model="form.keterangan_usulan"
            @update:model-value="
              (value:any) => insertTheRevision('surat_usulan', value, 'keterangan')
            "
            label="keterangan"
            outlined
          />
        </div>
      </div>
      <div class="row q-my-md">
        <div class="col-6">
          <q-btn
            @click="downloadSuratPernyataan"
            color="primary"
            label="Lihat Surat Pernyataan"
            style="width: 250px"
          >
            <q-icon name="download" class="cursor-pointer" />
          </q-btn>
          <q-toggle
            v-model="form.is_surat_pernyataan_sesuai"
            @update:model-value="
              (value:any) => insertTheRevision('surat_pernyataan', value, 'is_ok')
            "
            label=""
          />
          {{ form.is_surat_pernyataan_sesuai ? 'Sesuai' : 'Tidak Sesuai' }}
        </div>
        <div class="col-6" v-if="!form.is_surat_pernyataan_sesuai">
          <q-input
            type="textarea"
            v-model="form.keterngan_pernyataan"
            @update:model-value="
              (value:any) => insertTheRevision('surat_pernyataan', value, 'keterangan')
            "
            label="keterangan"
            outlined
          />
        </div>
      </div>
      <div class="row q-my-md">
        <div class="col-12">
          <q-stepper
            v-model="step"
            ref="stepper"
            color="primary"
            header-nav
            animated
          >
            <!-- start surat telaahan & berita acara penelitan -->
            <q-step
              v-if="suratTelahaanAndBeritaAcaraPenelitian !== undefined"
              :name="suratTelahaanAndBeritaAcaraPenelitian.step_order"
              title="Upload Surat Telaahan & Berita Acara Penelitian"
              caption="required"
              :done="step > suratTelahaanAndBeritaAcaraPenelitian.step_order"
              icon="upload"
            >
              <div class="row">
                <div class="col-6 q-px-xs">
                  <q-input
                    v-model="form.no_surat_telaahan"
                    label="No Surat Telaahan"
                    outlined
                  />
                </div>
                <div class="col-6 q-px-xs">
                  <q-input
                    outlined
                    v-model="form.tgl_surat_telaahan"
                    mask="date"
                    label="Tanggal Surat Telaahan"
                    :rules="[
                      'date',
                      (val) =>
                        (val !== null && val !== '') ||
                        'Mohon isi tanggal usulan',
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
                            v-model="form.tgl_surat_telaahan"
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
                <div class="col-12">
                  <template>
                    <span
                      v-for="(file, index) in form.upload_surat_telaahan"
                      v-bind:key="index"
                    >
                      <q-chip
                        v-if="!file.iscreate"
                        removable
                        @remove="removedTelaahan([file])"
                        color="primary"
                        text-color="white"
                        icon="attachment"
                        :label="file.name"
                        :title="file.name"
                      />
                    </span>
                  </template>
                  <q-uploader
                    :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
                    :headers="[
                      { name: 'Authorization', value: 'Bearer ' + token },
                      { name: 'Accept-Type', value: 'application/json' },
                    ]"
                    ref="telaahanUploader"
                    label="Surat Telaahan"
                    @uploaded="uploadedTelaahan"
                    @removed="removedTelaahan"
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
                          <div class="q-uploader__title">Surat Telaahan</div>
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
              <div class="row q-mt-md">
                <div class="col-6 q-px-xs">
                  <q-input
                    v-model="form.no_berita_acara_penelitian"
                    label="No Berita Acara Penelitian"
                    outlined
                  />
                </div>
                <div class="col-6 q-px-xs">
                  <q-input
                    outlined
                    v-model="form.tgl_berita_acara_penelitian"
                    mask="date"
                    label="Tanggal Berita Acara Penelitian"
                    :rules="[
                      'date',
                      (val) =>
                        (val !== null && val !== '') ||
                        'Mohon isi tanggal usulan',
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
                            v-model="form.tgl_berita_acara_penelitian"
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
                <div class="col-12">
                  <template>
                    <span
                      v-for="(
                        file, index
                      ) in form.upload_berita_acara_penelitian"
                      v-bind:key="index"
                    >
                      <q-chip
                        v-if="!file.iscreate"
                        removable
                        @remove="removedBeritaAcaraPenelitian([file])"
                        color="primary"
                        text-color="white"
                        icon="attachment"
                        :label="file.name"
                        :title="file.name"
                      />
                    </span>
                  </template>
                  <q-uploader
                    :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
                    :headers="[
                      { name: 'Authorization', value: 'Bearer ' + token },
                      { name: 'Accept-Type', value: 'application/json' },
                    ]"
                    ref="telaahanUploader"
                    label="Surat Telaahan"
                    @uploaded="uploadedBeritaAcaraPenelitian"
                    @removed="removedBeritaAcaraPenelitian"
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
                          <div class="q-uploader__title">
                            Berita Acara Penelitian
                          </div>
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
            </q-step>
            <!-- end surat telaahan & berita acara penelitan -->

            <!-- start surat telaahan -->
            <q-step
              v-if="suratTelaahan !== undefined"
              :name="suratTelaahan.step_order"
              title="Upload Surat Telaahan"
              caption="required"
              :done="step > suratTelaahan.step_order"
              icon="upload"
            >
              <div class="row">
                <div class="col-6 q-px-xs">
                  <q-input
                    v-model="form.no_surat_telaahan"
                    label="No Surat Pengantar"
                    outlined
                  />
                </div>
                <div class="col-6 q-px-xs">
                  <q-input
                    outlined
                    v-model="form.tgl_surat_telaahan"
                    mask="date"
                    label="Tanggal Surat Pengantar"
                    :rules="[
                      'date',
                      (val) =>
                        (val !== null && val !== '') ||
                        'Mohon isi tanggal usulan',
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
                            v-model="form.tgl_surat_telaahan"
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
                <div class="col-12">
                  <template>
                    <span
                      v-for="(file, index) in form.upload_surat_telaahan"
                      v-bind:key="index"
                    >
                      <q-chip
                        v-if="!file.iscreate"
                        removable
                        @remove="removedTelaahan([file])"
                        color="primary"
                        text-color="white"
                        icon="attachment"
                        :label="file.name"
                        :title="file.name"
                      />
                    </span>
                  </template>
                  <q-uploader
                    :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
                    :headers="[
                      { name: 'Authorization', value: 'Bearer ' + token },
                      { name: 'Accept-Type', value: 'application/json' },
                    ]"
                    ref="telaahanUploader"
                    label="Surat Telaahan"
                    @uploaded="uploadedTelaahan"
                    @removed="removedTelaahan"
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
                          <div class="q-uploader__title">Surat Telaahan</div>
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
            </q-step>
            <!-- end surat telaahan -->

            <!-- start surat pengatar 1 -->
            <q-step
              v-if="suratPengantar1 !== undefined"
              :name="suratPengantar1.step_order"
              title="Upload Surat Pengantar"
              caption="required"
              :done="step > suratPengantar1.step_order"
              icon="upload"
            >
              <div class="row">
                <div class="col-6 q-px-xs">
                  <q-input
                    v-model="form.no_surat_pengantar"
                    label="No Surat Pengantar"
                    outlined
                  />
                </div>
                <div class="col-6 q-px-xs">
                  <q-input
                    outlined
                    v-model="form.tgl_surat_pengantar"
                    mask="date"
                    label="Tanggal Surat Pengantar"
                    :rules="[
                      'date',
                      (val) =>
                        (val !== null && val !== '') ||
                        'Mohon isi tanggal usulan',
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
                            v-model="form.tgl_surat_pengantar"
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
                <div class="col-12">
                  <template v-if="!isCreate">
                    <span
                      v-for="(file, index) in form.upload_surat_pengantar_1"
                      v-bind:key="index"
                    >
                      <q-chip
                        v-if="!file.iscreate"
                        removable
                        @remove="removedPengantar1([file])"
                        color="primary"
                        text-color="white"
                        icon="attachment"
                        :label="file.name"
                        :title="file.name"
                      />
                    </span>
                  </template>
                  <q-uploader
                    :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
                    :headers="[
                      { name: 'Authorization', value: 'Bearer ' + token },
                      { name: 'Accept-Type', value: 'application/json' },
                    ]"
                    ref="usulanUploader"
                    label="Surat Pengantar"
                    @uploaded="uploadedPengantar1"
                    @removed="removedPengantar1"
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
                          <div class="q-uploader__title">Surat Pengantar</div>
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
            </q-step>
            <!-- end surat pengatar -->

            <!-- start surat pertimbangan and jawaban -->
            <q-step
              v-if="suratPertimbanganAndJawaban !== undefined"
              :name="suratPertimbanganAndJawaban.step_order"
              title="Upload Surat Pertimbangan & Jawaban"
              icon="upload"
              :done="step > suratPertimbanganAndJawaban.step_order"
            >
              <div class="row">
                <div class="col-6 q-px-xs">
                  <q-input
                    v-model="form.no_surat_pertimbangan"
                    label="No Surat Pertimbangan"
                    outlined
                  />
                </div>
                <div class="col-6 q-px-xs">
                  <q-input
                    outlined
                    v-model="form.tgl_surat_pertimbangan"
                    mask="date"
                    label="Tanggal Surat Pertimbangan"
                    :rules="[
                      'date',
                      (val) =>
                        (val !== null && val !== '') ||
                        'Mohon isi tanggal pertimbangan',
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
                            v-model="form.tgl_surat_pertimbangan"
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
                <div class="col-12">
                  <template v-if="!isCreate">
                    <span
                      v-for="(file, index) in form.upload_surat_pertimbangan"
                      v-bind:key="index"
                    >
                      <q-chip
                        v-if="!file.iscreate"
                        removable
                        @remove="removedPertimbangan([file])"
                        color="primary"
                        text-color="white"
                        icon="attachment"
                        :label="file.name"
                        :title="file.name"
                      />
                    </span>
                  </template>
                  <q-uploader
                    :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
                    :headers="[
                      { name: 'Authorization', value: 'Bearer ' + token },
                      { name: 'Accept-Type', value: 'application/json' },
                    ]"
                    ref="usulanUploader"
                    label="Surat Pertimbangan"
                    @uploaded="uploadedPertimbangan"
                    @removed="removedPertimbangan"
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
                          <div class="q-uploader__title">
                            Surat Pertimbangan
                          </div>
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
            </q-step>
            <!-- end surat pertimbangan and jawaban -->

            <!-- start surat pertimbangan -->
            <q-step
              v-if="suratPertimbangan !== undefined"
              :name="suratPertimbangan.step_order"
              title="Upload Surat Pertimbangan"
              icon="upload"
              :done="step > suratPertimbangan.step_order"
            >
              <div class="row">
                <div class="col-6 q-px-xs">
                  <q-input
                    v-model="form.no_surat_pertimbangan"
                    label="No Surat Pertimbangan"
                    outlined
                  />
                </div>
                <div class="col-6 q-px-xs">
                  <q-input
                    outlined
                    v-model="form.tgl_surat_pertimbangan"
                    mask="date"
                    label="Tanggal Surat Pertimbangan"
                    :rules="[
                      'date',
                      (val) =>
                        (val !== null && val !== '') ||
                        'Mohon isi tanggal pertimbangan',
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
                            v-model="form.tgl_surat_pertimbangan"
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
                <div class="col-12">
                  <template v-if="!isCreate">
                    <span
                      v-for="(file, index) in form.upload_surat_pertimbangan"
                      v-bind:key="index"
                    >
                      <q-chip
                        v-if="!file.iscreate"
                        removable
                        @remove="removedPertimbangan([file])"
                        color="primary"
                        text-color="white"
                        icon="attachment"
                        :label="file.name"
                        :title="file.name"
                      />
                    </span>
                  </template>
                  <q-uploader
                    :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
                    :headers="[
                      { name: 'Authorization', value: 'Bearer ' + token },
                      { name: 'Accept-Type', value: 'application/json' },
                    ]"
                    ref="usulanUploader"
                    label="Surat Pertimbangan"
                    @uploaded="uploadedPertimbangan"
                    @removed="removedPertimbangan"
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
                          <div class="q-uploader__title">
                            Surat Pertimbangan
                          </div>
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
            </q-step>
            <!-- end surat pertimbangan and jawaban -->

            <!-- start surat persetujuan -->
            <q-step
              v-if="suratPersetujuan !== undefined"
              :name="suratPersetujuan.step_order"
              title="Upload Surat Persetujuan"
              caption="required"
              icon="upload"
              :done="step > suratPersetujuan.step_order"
            >
              <div class="row">
                <div class="col-6 q-px-xs">
                  <q-input
                    v-model="form.no_surat_persetujuan"
                    label="No Surat Persetujuan"
                    outlined
                  />
                </div>
                <div class="col-6 q-px-xs">
                  <q-input
                    outlined
                    v-model="form.tgl_surat_persetujuan"
                    mask="date"
                    label="Tanggal Surat Persetujuan"
                    :rules="[
                      'date',
                      (val) =>
                        (val !== null && val !== '') ||
                        'Mohon isi tanggal persetujuan',
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
                            v-model="form.tgl_surat_persetujuan"
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
                <div class="col-12">
                  <template v-if="!isCreate">
                    <span
                      v-for="(file, index) in form.upload_surat_persetujuan"
                      v-bind:key="index"
                    >
                      <q-chip
                        v-if="!file.iscreate"
                        removable
                        @remove="removedPersetujuan([file])"
                        color="primary"
                        text-color="white"
                        icon="attachment"
                        :label="file.name"
                        :title="file.name"
                      />
                    </span>
                  </template>
                  <q-uploader
                    :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
                    :headers="[
                      { name: 'Authorization', value: 'Bearer ' + token },
                      { name: 'Accept-Type', value: 'application/json' },
                    ]"
                    ref="usulanUploader"
                    label="Surat Persetujuan"
                    @uploaded="uploadedPersetujuan"
                    @removed="removedPersetujuan"
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
                          <div class="q-uploader__title">Surat Persetujuan</div>
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
            </q-step>
            <!-- end surat persetujuan -->

            <!-- start surat pengatar -->
            <q-step
              v-if="suratPengantar !== undefined"
              :name="suratPengantar.step_order"
              title="Upload Surat Pengantar"
              caption="required"
              :done="step > suratPengantar.step_order"
              icon="upload"
            >
              <div class="row">
                <div class="col-6 q-px-xs">
                  <q-input
                    v-model="form.no_surat_pengantar"
                    label="No Surat Pengantar"
                    outlined
                  />
                </div>
                <div class="col-6 q-px-xs">
                  <q-input
                    outlined
                    v-model="form.tgl_surat_pengantar"
                    mask="date"
                    label="Tanggal Surat Pengantar"
                    :rules="[
                      'date',
                      (val) =>
                        (val !== null && val !== '') ||
                        'Mohon isi tanggal usulan',
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
                            v-model="form.tgl_surat_pengantar"
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
                <div class="col-12">
                  <template v-if="!isCreate">
                    <span
                      v-for="(file, index) in form.upload_surat_pengantar"
                      v-bind:key="index"
                    >
                      <q-chip
                        v-if="!file.iscreate"
                        removable
                        @remove="removedPengantar([file])"
                        color="primary"
                        text-color="white"
                        icon="attachment"
                        :label="file.name"
                        :title="file.name"
                      />
                    </span>
                  </template>
                  <q-uploader
                    :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
                    :headers="[
                      { name: 'Authorization', value: 'Bearer ' + token },
                      { name: 'Accept-Type', value: 'application/json' },
                    ]"
                    ref="usulanUploader"
                    label="Surat Pengantar"
                    @uploaded="uploadedPengantar"
                    @removed="removedPengantar"
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
                          <div class="q-uploader__title">Surat Pengantar</div>
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
            </q-step>
            <!-- end surat pengatar -->

            <!-- start surat kepgub -->
            <q-step
              v-if="suratKepgub !== undefined"
              :name="suratKepgub.step_order"
              title="Upload Surat Kepgub"
              caption="required"
              :done="step > suratKepgub.step_order"
              icon="upload"
            >
              <div class="row">
                <div class="col-6 q-px-xs">
                  <q-input
                    v-model="form.no_surat_kepgub"
                    label="No Surat Kepgub"
                    outlined
                  />
                </div>
                <div class="col-6 q-px-xs">
                  <q-input
                    outlined
                    v-model="form.tgl_surat_kepgub"
                    mask="date"
                    label="Tanggal Surat Kepgub"
                    :rules="[
                      'date',
                      (val) =>
                        (val !== null && val !== '') ||
                        'Mohon isi tanggal usulan',
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
                            v-model="form.tgl_surat_kepgub"
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
                <div class="col-12">
                  <template v-if="!isCreate">
                    <span
                      v-for="(file, index) in form.upload_kepgub"
                      v-bind:key="index"
                    >
                      <q-chip
                        v-if="!file.iscreate"
                        removable
                        @remove="removedKepgub([file])"
                        color="primary"
                        text-color="white"
                        icon="attachment"
                        :label="file.name"
                        :title="file.name"
                      />
                    </span>
                  </template>
                  <q-uploader
                    :url="apiUrl + '/api/v1/pembongkaran/upload/surat-usulan'"
                    :headers="[
                      { name: 'Authorization', value: 'Bearer ' + token },
                      { name: 'Accept-Type', value: 'application/json' },
                    ]"
                    ref="usulanUploader"
                    label="Surat Kepgub"
                    @uploaded="uploadedKepgub"
                    @removed="removedKepgub"
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
                          <div class="q-uploader__title">
                            Surat Kepgub Nilai Limit
                          </div>
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
            </q-step>
            <!-- end surat kepgub -->

            <q-step
              :name="highHestOfGroupSecond + 1"
              title="Complete"
              caption="required"
              :done="step > highHestOfGroupSecond"
              icon="check"
            >
              <q-icon name="check_circle" color="green" size="3.4em" />Anda
              telah selesai upload seluruh dokumen.
            </q-step>

            <template v-slot:navigation>
              <q-stepper-navigation>
                <q-btn
                  @click="nextStep"
                  v-if="step <= highHestOfGroupSecond"
                  color="primary"
                  :label="step === highHestOfGroupSecond ? 'Save' : 'Continue'"
                />
                <q-btn
                  v-if="step > 1"
                  flat
                  color="primary"
                  @click="previousStep"
                  label="Back"
                  class="q-ml-sm"
                />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-12">
          <q-table
            title="Items"
            :rows="asetItems"
            :columns="columnSearchBarang"
            v-model:pagination="pagination"
            row-key="id"
            :separator="'cell'"
            ref="tableRef"
          />
        </div>
      </div>
      <div class="row q-pt-md" align="right">
        <q-btn
          label="Sahkan"
          :disable="step < highHestOfGroupSecond + 1"
          @click="onSubmit(true)"
          type="submit"
          color="green"
          class="q-mr-md"
        />
        <q-btn
          v-if="form.status != 'S'"
          label="Draft"
          color="green"
          class="q-mr-md"
          @click="onSubmit(false)"
        />
        <q-btn
          label="Revisi"
          :disable="step > lowestOfGroupSecond"
          @click="onRevise()"
          color="red"
          class="q-nr-md"
        />
      </div>
    </q-form>
  </div>
</template>
<script lang="ts">
import { PembongkaranModel } from 'components/models/pembongkaran';
import { Validation } from 'components/models/validation';
import { PembongkaranValidationRevise } from 'components/models/validation_revise';
import { defineComponent, ref, computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { UploadModel, QUploadModel } from 'components/models/common';
import { response } from 'express';

export default defineComponent({
  name: 'ValidationPage',
  async mounted() {
    if (!this.$route.params.id) {
      this.$router.back();
      return;
    }

    this.form.pembongkaran_id = this.$route.params.id;

    await this.getDataPembongkaranById(this.$route.params.id);

    await this.getDataValidation(this.form.pembongkaran_id as number);
  },
  setup() {
    const store = useStore();
    const apiUrl = process.env.API_URL;
    const existingData = ref<PembongkaranModel>({
      asets: [],
    });

    const asetItems = ref([]);
    const step = ref(1);
    const form = ref<Validation>({
      is_surat_pernyataan_sesuai: true,
      is_surat_usulan_sesuai: true,
      keterangan: '',
      upload_surat_jawaban: [],
      upload_surat_pengantar: [],
      upload_surat_persetujuan: [],
      upload_surat_pertimbangan: [],
      upload_surat_telaahan: [],
      upload_kepgub: [],
      pembongkaran_id: 0,
    });
    const pagination = reactive({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
      // rowsNumber: xx if getting data from a server
    });
    const token = computed({
      get: () => store.state.auth.token,
      set: (val: any) => {
        store.commit('auth/setCode', val);
      },
    });

    const highHestOfGroupSecond = computed({
      get: () => {
        return existingData.value.feature.workflows
          .filter((d) => {
            return d.group_flow == 'second';
          })
          .sort((a, b) => {
            return b.step_order - a.step_order;
          })[0].step_order;
      },
      set: (val: any) => {
        // do nothing
      },
    });

    const lowestOfGroupSecond = computed({
      get: () => {
        return existingData.value.feature.workflows
          .filter((d) => {
            return d.group_flow == 'second';
          })
          .sort((a, b) => {
            return a.step_order - b.step_order;
          })[0].step_order;
      },
      set: (val: any) => {
        // do nothing
      },
    });

    const suratTelahaanAndBeritaAcaraPenelitian = computed({
      get: () => {
        return existingData.value.feature.workflows.find((d) => {
          return d.name == 'upload_telaahan_and_berita_acara_penelitian';
        });
      },
      set: (val: any) => {
        // do nothing
      },
    });

    const suratPertimbanganAndJawaban = computed({
      get: () => {
        return existingData.value.feature.workflows.find((d) => {
          return d.name == 'upload_pertimbangan_and_upload_jawaban';
        });
      },
      set: (val: any) => {
        // do nothing
      },
    });

    const suratPertimbangan = computed({
      get: () => {
        return existingData.value.feature.workflows.find((d) => {
          return d.name == 'upload_pertimbangan';
        });
      },
      set: (val: any) => {
        // do nothing
      },
    });

    const suratPersetujuan = computed({
      get: () => {
        return existingData.value.feature.workflows.find((d) => {
          return d.name == 'upload_persetujuan';
        });
      },
      set: (val: any) => {
        // do nothing
      },
    });

    const suratPengantar = computed({
      get: () => {
        return existingData.value.feature.workflows.find((d) => {
          return d.name == 'upload_pengantar';
        });
      },
      set: (val: any) => {
        // do nothing
      },
    });

    const suratPengantar1 = computed({
      get: () => {
        return existingData.value.feature.workflows.find((d) => {
          return d.name == 'upload_pengantar_1';
        });
      },
      set: (val: any) => {
        // do nothing
      },
    });

    const suratKepgub = computed({
      get: () => {
        return existingData.value.feature.workflows.find((d) => {
          return d.name == 'upload_kepgub_nilai_limit';
        });
      },
      set: (val: any) => {
        // do nothing
      },
    });

    const suratTelaahan = computed({
      get: () => {
        return existingData.value.feature.workflows.find((d) => {
          return d.name == 'upload_telaahan';
        });
      },
      set: (val: any) => {
        // do nothing
      },
    });
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
      // {
      //   name: 'upload_media',
      //   label: 'Upload Media',
      //   field: 'upload_media',
      // },
      // {
      //   name: 'upload_file',
      //   label: 'Upload File',
      //   field: 'upload_file',
      // },
    ];
    const isCreate = true;
    const autoUploadSuratJawaban = true;

    const authToken = computed({
      get: () => store.state.auth.token,
      set: (val) => {
        store.commit('auth/setToken', val);
      },
    });

    const revisionStacksHeader = ref<PembongkaranValidationRevise[]>([]);

    return {
      revisionStacksHeader,
      suratKepgub,
      highHestOfGroupSecond,
      lowestOfGroupSecond,
      suratPertimbangan,
      suratTelahaanAndBeritaAcaraPenelitian,
      suratPertimbanganAndJawaban,
      suratPengantar1,
      suratPengantar,
      suratPersetujuan,
      suratTelaahan,
      form,
      autoUploadSuratJawaban,
      isCreate,
      step,
      authToken,
      apiUrl,
      asetItems,
      existingData,
      token,
      pagination,
      columnSearchBarang,
    };
  },
  watch: {
    step: {
      handler() {
        this.manuallySetIsCreateFile(false);
      },
    },
  },
  methods: {
    insertTheRevision(code: string, val: any, typeOfField: string) {
      const reviseIndex = this.revisionStacksHeader.findIndex((d) => {
        return d.code_field == code;
      });

      if (reviseIndex > -1) {
        if (typeOfField == 'is_ok') {
          this.revisionStacksHeader[reviseIndex].is_ok = val;
        } else if (typeOfField == 'keterangan') {
          this.revisionStacksHeader[reviseIndex].keterangan = val;
        }
      } else {
        this.revisionStacksHeader.push({
          code_field: code,
          pembongkaran_id: this.existingData.id,
          validation_id: this.form.id,
          feature_id: this.existingData.feature.id,
          is_ok: typeOfField == 'is_ok' ? val : null,
          keterangan: typeOfField == 'keterangan' ? val : '',
        });
      }

      console.log(this.revisionStacksHeader);
    },
    nextStep() {
      // update the status of data here
      this.$q.loading.show({
        message: 'Upadating data... please wait',
      });
      this.$api
        .post(
          `api/v1/pembongkaran/core/update-status/${this.$route.params.id}`,
          {
            data: this.form,
            status_data: {
              pembongkaran_id: this.$route.params.id,
              feature_workflow_code: this.existingData.feature.workflows.find(
                (d) => {
                  return d.step_order == this.step && !d.is_revise_status;
                }
              ).workflow_code,
            },
          }
        )
        .then((response: any) => {
          console.log(response);
          this.$refs.stepper.next();
          this.$q.notify({
            message: 'Data updated.',
            color: 'green',
          });
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    previousStep() {
      // update the status of data here
      this.$q.loading.show({
        message: 'Upadating data... please wait',
      });
      this.$api
        .post(
          `api/v1/pembongkaran/core/update-status/${this.$route.params.id}`,
          {
            data: this.form,
            status_data: {
              pembongkaran_id: this.$route.params.id,
              feature_workflow_code: this.existingData.feature.workflows.find(
                (d) => {
                  return d.step_order == this.step && !d.is_revise_status;
                }
              ).workflow_code,
            },
          }
        )
        .then((response: any) => {
          console.log(response);
          this.$refs.stepper.previous();
          this.$q.notify({
            message: 'Data updated.',
            color: 'green',
          });
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    // manualAttachFiles() {
    //   this.autoUploadSuratJawaban = false;
    //   this.form.upload_surat_jawaban.forEach((f) => {
    //     this.$refs.jawabanUploader.addFiles([new File(['foo'], f.__key)]);
    //   });
    //   this.autoUploadSuratJawaban = true;
    // },
    async getDataValidation(id: number) {
      this.$api
        .get(`api/v1/pembongkaran/core/validation/getonebypembongkaranid/${id}`)
        .then((response: any) => {
          let data = { response };
          this.isCreate = false;
          this.form = data.response.data.data as Validation;
          // this.manualAttachFiles();
        });
    },
    manuallySetIsCreateFile(iscreate: boolean) {
      if (this.form.upload_surat_jawaban) {
        this.form.upload_surat_jawaban.map((f) => {
          f.iscreate = iscreate;
          return f;
        });
      }

      if (this.form.upload_surat_pengantar) {
        this.form.upload_surat_pengantar.map((f) => {
          f.iscreate = iscreate;
          return f;
        });
      }

      if (this.form.upload_surat_persetujuan) {
        this.form.upload_surat_persetujuan.map((f) => {
          f.iscreate = iscreate;
          return f;
        });
      }

      if (this.form.upload_surat_pertimbangan) {
        this.form.upload_surat_pertimbangan.map((f) => {
          f.iscreate = iscreate;
          return f;
        });
      }
    },
    onRevise() {
      this.manuallySetIsCreateFile(false);

      let url = `api/v1/pembongkaran/core/revise/${this.existingData.id}`;

      const self = this;
      this.$q.loading.show({
        message: 'Submitting, please wait...',
      });
      this.$api
        .post(url, {
          revises: this.revisionStacksHeader,
          status_data: {
            pembongkaran_id: this.$route.params.id,
            feature_workflow_code: this.existingData.feature.workflows.find(
              (d) => {
                return (
                  d.step_order == this.lowestOfGroupSecond && d.is_revise_status
                );
              }
            ).workflow_code,
          },
        } as any)
        .then((response: any) => {
          this.$q.notify({
            message: 'Data has been revised.',
            color: 'green',
          });
          this.$q.loading.hide();
          this.$router.push({ path: '/pengajuan', replace: true });
        })
        .catch(function (err: any) {
          if (err.response.status == 422) {
            // validation error
            self.$q.notify({
              message: err.response.data.message,
              color: 'red',
            });
          }
          if (self.isCreate) {
            self.manuallySetIsCreateFile(true);
          }

          self.$q.loading.hide();
        });
    },
    onSubmit(isSubmit: boolean) {
      // save the feedback
      if (isSubmit) {
        this.form.status = 'S';
      } else {
        this.form.status = 'D';
      }

      this.form.revises = this.revisionStacksHeader;

      this.manuallySetIsCreateFile(false);

      let url = 'api/v1/pembongkaran/core/validation/store';
      if (!this.isCreate) {
        url = `api/v1/pembongkaran/core/validation/update/${this.form.id}`;
      }

      const self = this;
      this.$q.loading.show({
        message: 'Submitting, please wait...',
      });
      this.$api
        .post(url, this.form)
        .then((response: any) => {
          this.$q.notify({
            message: 'Data has been saved.',
            color: 'green',
          });
          this.$q.loading.hide();
          this.$router.push({ path: '/pengajuan', replace: true });
        })
        .catch(function (err: any) {
          if (err.response.status == 422) {
            // validation error
            self.$q.notify({
              message: err.response.data.message,
              color: 'red',
            });
          }
          if (self.isCreate) {
            self.manuallySetIsCreateFile(true);
          }

          self.$q.loading.hide();
        });
    },
    removedKepgub(info: any) {
      const indexMustBeDelete = this.form.upload_kepgub.findIndex((d) => {
        return d.__key == info[0].__key;
      });
      this.form.upload_kepgub.splice(indexMustBeDelete, 1);
    },
    uploadedKepgbu(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.iscreate = true;
      infoUploadedFile.origin = info.files[0];
      this.form.upload_kepgub.push(infoUploadedFile);
    },
    removedBeritaAcaraPenelitian(info: any) {
      const indexMustBeDelete =
        this.form.upload_berita_acara_penelitian.findIndex((d) => {
          return d.__key == info[0].__key;
        });
      this.form.upload_berita_acara_penelitian.splice(indexMustBeDelete, 1);
    },
    uploadedBeritaAcaraPenelitian(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.iscreate = true;
      infoUploadedFile.origin = info.files[0];
      this.form.upload_berita_acara_penelitian.push(infoUploadedFile);
    },
    removedTelaahan(info: any) {
      const indexMustBeDelete = this.form.upload_surat_jawaban.findIndex(
        (d) => {
          return d.__key == info[0].__key;
        }
      );
      this.form.upload_surat_jawaban.splice(indexMustBeDelete, 1);
    },
    uploadedTelaahan(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.iscreate = true;
      infoUploadedFile.origin = info.files[0];
      this.form.upload_surat_telaahan.push(infoUploadedFile);
    },
    removedJawaban(info: any) {
      const indexMustBeDelete = this.form.upload_surat_telaahan.findIndex(
        (d) => {
          return d.__key == info[0].__key;
        }
      );
      this.form.upload_surat_telaahan.splice(indexMustBeDelete, 1);
    },
    uploadedJawaban(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.iscreate = true;
      infoUploadedFile.origin = info.files[0];
      this.form.upload_surat_jawaban.push(infoUploadedFile);
    },
    removedPertimbangan(info: any) {
      const indexMustBeDelete = this.form.upload_surat_pertimbangan.findIndex(
        (d) => {
          return d.__key == info[0].__key;
        }
      );
      this.form.upload_surat_pertimbangan.splice(indexMustBeDelete, 1);
    },
    uploadedPertimbangan(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.iscreate = true;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.origin = info.files[0];
      this.form.upload_surat_pertimbangan.push(infoUploadedFile);
    },
    removedPengantar1(info: any) {
      const indexMustBeDelete = this.form.upload_surat_pengantar_1.findIndex(
        (d) => {
          return d.__key == info[0].__key;
        }
      );
      this.form.upload_surat_pengantar_1.splice(indexMustBeDelete, 1);
    },
    uploadedPengantar1(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.iscreate = true;
      infoUploadedFile.origin = info.files[0];
      this.form.upload_surat_pengantar_1.push(infoUploadedFile);
    },
    removedPengantar(info: any) {
      const indexMustBeDelete = this.form.upload_surat_pengantar.findIndex(
        (d) => {
          return d.__key == info[0].__key;
        }
      );
      this.form.upload_surat_pengantar.splice(indexMustBeDelete, 1);
    },
    uploadedPengantar(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.iscreate = true;
      infoUploadedFile.origin = info.files[0];
      this.form.upload_surat_pengantar.push(infoUploadedFile);
    },
    removedPersetujuan(info: any) {
      const indexMustBeDelete = this.form.upload_surat_persetujuan.findIndex(
        (d) => {
          return d.__key == info[0].__key;
        }
      );
      this.form.upload_surat_persetujuan.splice(indexMustBeDelete, 1);
    },
    uploadedPersetujuan(info: any) {
      const infoUploadedFile = JSON.parse(info.xhr.response) as UploadModel;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.__key = info.files[0].__key;
      infoUploadedFile.iscreate = true;
      infoUploadedFile.name = info.files[0].name;
      infoUploadedFile.origin = info.files[0];
      this.form.upload_surat_persetujuan.push(infoUploadedFile);
    },
    checkMimeType(mimeType: string): string {
      if (mimeType == 'application/vnd.ms-excel') {
        return 'xlsx';
      }
      return '';
    },
    downloadSuratPernyataan() {
      window.open(
        `${process.env.API_URL}/api/v1/pembongkaran/upload/file?token=${this.authToken}&path=${this.existingData.upload_surat_pernyataan[0].data.filetmpname}`,
        '_blank'
      );
    },
    downloadSuratUsulan() {
      window.open(
        `${process.env.API_URL}/api/v1/pembongkaran/upload/file?token=${this.authToken}&path=${this.existingData.upload_surat_usulan[0].data.filetmpname}`,
        '_blank'
      );
    },
    async getDataPembongkaranById(id: any) {
      this.$api
        .get(`api/v1/pembongkaran/core/one/${id}`)
        .then((response: any) => {
          let data = { response };
          this.existingData = data.response.data as PembongkaranModel;
          this.step =
            this.existingData.statuses.workflow.step_order == 0
              ? 1
              : this.existingData.statuses.workflow.step_order;
          this.asetItems = this.existingData.asets;
        });
    },
  },
});
</script>
