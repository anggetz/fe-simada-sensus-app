import { UploadModel } from './common';
import { PembongkaranValidationRevise } from './validation_revise';
import { Validation } from './validation';

export interface Aset {
  inventaris_id: number;
  kode_barang: string;
  nama_barang: string;
  upload_media: UploadModel[];
  upload_file: UploadModel[];
}

export interface Workflow {
  alias_status_name: string;
  created_at: string;
  feature_code: number;
  id: number;
  is_can_be_revise: boolean;
  is_final: boolean;
  name: string;
  revise_back: number;
  revise_status: string;
  step_order: number;
  to_do: [];
  trigger_final: [];
  updated_at: string;
  group_flow: string;
  is_revise_status: boolean;
  workflow_code: string;
}

export interface Feature {
  id: number;
  code: number;
  inventaris_id: number;
  kode_barang: string;
  nama_barang: string;
  upload_media: UploadModel[];
  upload_file: UploadModel[];
  workflows: Workflow[];
  workflow: Workflow;
}

export interface Status {
  created_at: string;
  feature_workflow_code: string;
  id: number;
  pembongkaran_id: number;
  workflow: Workflow;
}

export interface PembongkaranModel {
  id: number;
  cabang_dinas_id: number;
  sekolah_id: number;
  tanggal_usulan: string;
  upload_surat_usulan: UploadModel[];
  no_surat_usulan: string;
  no_surat_pernyataan: string;
  no_surat_laporan: string;
  no_surat_buku_penilaian: string;
  no_surat_berita_acara: string;

  tgl_surat_usulan: string;
  tgl_surat_buku_penilaian: string;
  tgl_surat_laporan: string;
  tgl_surat_pernyataan: string;

  tgl_surat_berita_acara: string;
  statuses: Status;
  upload_buku_penilaian: UploadModel[];
  upload_surat_pernyataan: UploadModel[];
  upload_berita_acara: UploadModel[];
  upload_laporan: UploadModel[];
  revises: PembongkaranValidationRevise[];
  jenis: string;
  feature: Feature;
  status_history: Feature[];
  asets: Aset[];
  validation: Validation;
}
