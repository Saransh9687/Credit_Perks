export interface CesUser {
  id: number;
  username: string;
  role: string;
  active: boolean;
  createdAt?: string;
}

export interface CreateCesUserRequest {
  username: string;
  password: string;
  role: string;
}
