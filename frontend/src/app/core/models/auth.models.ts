export interface User {
  username: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export enum UserRole {
  ADMIN = 'ROLE_ADMIN_CES',
  USER = 'ROLE_CES_USER'
}
