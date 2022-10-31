import { UploadModel } from './common';

export interface Validation {
  id: number;
  is_surat_usulan_sesuai: boolean;
  is_surat_pernyataan_sesuai: boolean;
  keterangan: string;
  upload_surat_jawaban: UploadModel[];
  no_surat_jawaban: string;
  tgl_surat_jawaban: string;
  upload_surat_pengantar: UploadModel[];
  no_surat_pengantar: string;
  tgl_surat_pengantar: string;
  upload_surat_pertimbangan: UploadModel[];
  no_surat_pertimbangan: string;
  tgl_surat_pertimbangan: string;
  upload_surat_persetujuan: UploadModel[];
  no_surat_persetujuan: string;
  tgl_surat_persetujuan: string;

  upload_surat_pengantar_1: UploadModel[];
  no_surat_pengantar_1: string;
  tgl_surat_pengantar_1: string;

  upload_kepgub: UploadModel[];
  no_surat_kepgub: string;
  tgl_surat_kepgub: string;

  upload_surat_telaahan: UploadModel[];
  no_surat_telaahan: string;
  tgl_surat_telaahan: string;

  upload_berita_acara_penelitian: UploadModel[];
  no_berita_acara_penelitian: string;
  tgl_berita_acara_penelitian: string;

  status: string;
  pembongkaran_id: any;
}
