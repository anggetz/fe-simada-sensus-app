export interface TokenStorage {
  code: string;
  token: string;
}

export interface Auth {
  auth: TokenStorage;
}

export interface Organisasi {
  nama: string;
  level: number;
}

export interface User {
  username: string;
  name: string;
  organisasi: Organisasi;
}
