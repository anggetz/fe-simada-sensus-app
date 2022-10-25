export interface TokenStorage {
  code: string;
  token: string;
}

export interface Auth {
  auth: TokenStorage;
}

export interface Organisasi {
  nama: string;
}

export interface User {
  username: string;
  name: string;
  organisasi: Organisasi;
}
