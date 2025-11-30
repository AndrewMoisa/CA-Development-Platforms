export interface User {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}