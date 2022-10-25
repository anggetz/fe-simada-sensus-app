import { type } from 'os';

export interface UploadMoreDetailModel {
  filetmpname: string;
}

export interface QUploadModel {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

export interface UploadModel {
  tmpfilename: '';
  idInputer: number;
  id: number;
  data: UploadMoreDetailModel;
  __key: string;
  iscreate: boolean;
  name: string;
  origin: File;
}
